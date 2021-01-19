const jwt = require('jsonwebtoken');
const ErrorAuth = require('../errors/error-auth.js');
const { JWT_SECRET } = require('../configs/index');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new ErrorAuth('Необходима авторизация'));
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    next(new ErrorAuth('Авторизация не подтверждена'));
  }
  req.user = payload;
  next();
};
