const mess = require('../configs/message');

module.exports.err = (err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500
      ? mess.ERR_SERVER
      : message,
  });
  next();
};
