const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
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
    link: Joi.string()
      .pattern(/^https?:\/{2}[w{3}\\.]{0,1}[^\\/@/s._~:/?#\\[\]@!$&'()*+,;=][\w\W]{1,}#?$/),
    image: Joi.string()
      .pattern(/^https?:\/{2}[w{3}\\.]{0,1}[^\\/@/s._~:/?#\\[\]@!$&'()*+,;=][\w\W]{1,}#?$/),
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
