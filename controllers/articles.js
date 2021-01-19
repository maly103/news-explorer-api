const Article = require('../models/article');
const errorHandler = require('../errors/error');
const NotFoundError = require('../errors/not-found-err');
const ErrorAuth = require('../errors/error-auth');

module.exports.getArticles = (req, res, next) => {
  Article.find({ owner: req.user._id })
    .then((data) => res.send(data))
    .catch((err) => { errorHandler(err, res, next); });
};

module.exports.createArticle = (req, res, next) => {
  const {
    keyword, title, text, date, source, link, image,
  } = req.body;
  const owner = req.user._id;
  Article.create({
    keyword, title, text, date, source, link, image, owner,
  })
    .then((article) => res.send(article))
    .catch((err) => { errorHandler(err, res, next); });
};

module.exports.deleteArticle = (req, res, next) => {
  Article.findById(req.params.articleId)
    .orFail(() => {
      next(new NotFoundError('Статья не найдена'));
    })
    .then((article) => {
      if (!article.owner.equals(req.user._id)) {
        throw new ErrorAuth('Нет доступа');
      }
      Article.findByIdAndRemove(req.params.articleId)
        .then((art) => {
          res.status(200).send({ message: 'Статья удалена', data: art });
        })
        .catch(next);
    })
    .catch(next);
};
