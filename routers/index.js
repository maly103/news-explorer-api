const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { login, createUser } = require('../controllers/users');
const routerUsers = require('./users');
const routerArticles = require('./articles');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/not-found-err');

const validateUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

const validateData = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().required().min(2).max(30),
  }),
});

router.post('/signin', validateUser, login);
router.post('/signup', validateData, createUser);

router.use('/users', auth, routerUsers);
router.use('/articles', auth, routerArticles);

router.all('*', (req, res, next) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден'));
});

module.exports = router;
