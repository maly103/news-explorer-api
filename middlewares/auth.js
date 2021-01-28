const jwt = require('jsonwebtoken');
const ErrorAuth = require('../errors/error-auth.js');
const { JWT_SECRET } = require('../configs/index');
const message = require('../configs/message');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new ErrorAuth(message.NEED_AUTHORIZATION));
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return next(new ErrorAuth(message.FALSE_AUTHORIZATION));
  }
  req.user = payload;
  return next();
};
