const ValidationError = require('./validation-error');
const ErrorAuth = require('./error-auth');
const ErrorUnique = require('./error-unique');
const NotFoundError = require('./not-found-err');

module.exports = (err, res, next) => {
  if (err.name === 'ValidationError' || err.name === 'CastError') {
    next(new ValidationError(`${Object.values(err.errors).map((error) => error.message).join(', ')}`));
  } else if (err.name === 'DocumentNotFoundError') {
    next(new NotFoundError('Ресурс не найден'));
  } else if (err.name === 'Error') {
    next(new NotFoundError('Неверные данные'));
  } else if (err.kind === 'ObjectId') {
    next(new ErrorAuth('Индентификатор не найден'));
  } else if (err.code === 11000) {
    next(new ErrorUnique('данные уже есть'));
  } else {
    next(err);
  }
};
