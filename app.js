const express = require('express');
const bodyParser = require('body-parser');
const rateLimiter = require('express-rate-limit');
const { errors } = require('celebrate');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
const routerAll = require('./routers/index');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { limit } = require('./middlewares/limit');
const { err } = require('./middlewares/err');

const { PORT, DB_URL } = require('./configs/index');

const app = express();
mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(cors());

app.use(helmet());
app.use(bodyParser.json());

app.use(requestLogger);
app.use('/', routerAll);
app.use(errorLogger);

app.use(rateLimiter(limit));
app.use(errors());

app.use(err);

app.listen(PORT, () => {});
