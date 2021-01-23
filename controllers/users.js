const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { getJwtToken } = require('../configs/jwt');
const ErrorAuth = require('../errors/error-auth');
const ErrorUnique = require('../errors/error-unique');
const ValidationError = require('../errors/validation-error');
const NotFoundError = require('../errors/not-found-err');
const message = require('../configs/message');

module.exports.createUser = (req, res, next) => {
  const {
    email, password, name,
  } = req.body;
  User.findOne({ email }).then((user) => {
    if (user) {
      throw new ErrorUnique(message.DATA_EXISTS);
    }
    bcrypt.hash(password, 10).then((hash) => User.create({
      email, password: hash, name,
    })
      .then((data) => res.send(
        {
          email: data.email,
          name: data.name,
        },
      ))
      .catch((err) => {
        if (err.kind === 'ObjectId') {
          next(new ValidationError(message.NOT_OBJECTID));
        } else if (err.name === 'ValidationError' || err.name === 'CastError' || err.name === 'Error') {
          next(new ValidationError(`${Object.values(err.errors).map((error) => error.message).join(', ')}`));
        } else if (err.name === 'DocumentNotFoundError') {
          next(new NotFoundError(message.NOTFOUND_RESURS));
        } else if (err.kind === 'ObjectId') {
          next(new ErrorAuth(message.NOT_OBJECTID));
        } else if (err.code === 11000) {
          next(new ErrorUnique(message.DATA_EXISTS));
        } else {
          next(err);
        }
      }));
  })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new ErrorAuth(message.WRON_LOGIN);
      }
      bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new ErrorAuth(message.WRON_LOGIN);
          }
          const token = getJwtToken(user._id);
          res.send({ token });
        })
        .catch(next);
    })
    .catch(next);
};

module.exports.getUserMe = (req, res, next) => {
  const { _id } = req.user;
  User.findById(_id)
    .orFail(() => {
      throw new NotFoundError(message.NOT_OBJECTID);
    })
    .then((data) => {
      res.send({
        email: data.email,
        name: data.name,
      });
    })
    .catch(next);
};
