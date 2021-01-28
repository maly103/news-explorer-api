const router = require('express').Router();
const validator = require('validator');
const { celebrate, Joi } = require('celebrate');
const mess = require('../configs/message');
const {
  getArticles,
  createArticle,
  deleteArticle,
} = require('../controllers/articles');

const validateArticle = celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required(),
    title: Joi.string().required(),
    text: Joi.string().required(),
    date: Joi.string().required(),
    source: Joi.string().required(),
    link: Joi.string().custom((value, helper) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helper.message(mess.ERR_FORMAT);
    }),
    image: Joi.string().custom((value, helper) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helper.message(mess.ERR_FORMAT);
    }),
  }),
});

router.get('/', getArticles);
router.post('/', validateArticle, createArticle);
router.delete('/:articleId', celebrate({
  params: Joi.object().keys({
    articleId: Joi.string().required().length(24).hex(),
  }),
}), deleteArticle);

module.exports = router;
