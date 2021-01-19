const express = require('express');
const bodyParser = require('body-parser');
const rateLimiter = require('express-rate-limit');
const { errors } = require('celebrate');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
const routerAll = require('./routers/index');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const limit = require('./middlewares/limit');

const { PORT, DB_URL } = require('./configs/index');

const app = express();
mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(cors());
app.use(rateLimiter(limit));
app.use(helmet());
app.use(bodyParser.json());

app.use(requestLogger);
app.use('/', routerAll);
app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500
      ? 'На сервере произошла ошибка'
      : message,
  });
  next();
});

app.listen(PORT, () => {
  /* eslint-disable no-console */
  console.log(`App listening on port ${PORT}`);
  /* eslint-enable no-console */
});
