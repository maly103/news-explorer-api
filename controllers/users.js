const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { getJwtToken } = require('../configs/jwt');
const errorHandler = require('../errors/error');
const ErrorUnique = require('../errors/error-unique');
const ValidationError = require('../errors/validation-error');

module.exports.createUser = (req, res, next) => {
  const {
    email, password, name,
  } = req.body;
  User.findOne({ email }).then((user) => {
    if (user) {
      throw new ErrorUnique('Такой пользователь уже есть');
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
      .catch((err) => { errorHandler(err, res, next); }));
  })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new ValidationError('Неправильные почта или пароль');
      }
      bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new ValidationError('Неправильные почта или пароль');
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
      next();
    })
    .then((data) => {
      res.send({
        email: data.email,
        name: data.name,
      });
    })
    .catch();
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((data) => res.send(data))
    .catch();
};
