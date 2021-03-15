const Article = require('../models/article');
const NotFoundError = require('../errors/not-found-err');
const ErrorAuth = require('../errors/error-auth');
const ErrorForbidden = require('../errors/error-forbidden');
const ValidationError = require('../errors/validation-error');
const ErrorUnique = require('../errors/error-unique');
const message = require('../configs/message');

module.exports.getArticles = (req, res, next) => {
  Article.find({ owner: req.user._id })
    .then((data) => res.send(data))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError(message.NOTFOUND_RESURS));
      } else if (err.name === 'Forbidden') {
        next(new ErrorForbidden(message.NOT_ACCSES));
      } else {
        next(err);
      }
    });
};

module.exports.createArticle = (req, res, next) => {
  const {
    keyword, title, text, date, source, link, image,
  } = req.body;
  const owner = req.user._id;
  Article.create({
    keyword, title, text, date, source, link, image, owner,
  })
    .then((article) => {
      res.send({
        _id: article.id,
        keyword: article.keyword,
        title: article.title,
        text: article.text,
        date: article.date,
        source: article.source,
        link: article.link,
        image: article.image,
      });
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        next(new ValidationError(message.NOT_OBJECTID));
      } else if (err.name === 'ValidationError' || err.name === 'CastError' || err.name === 'Error') {
        next(new ValidationError(`${Object.values(err.errors).map((error) => error.message).join(', ')}`));
      } else if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError(message.NOTFOUND_RESURS));
      } else if (err.kind === 'ObjectId') {
        next(new ErrorAuth(message.NOT_OBJECTID));
      } else if (err.code === 11000) {
        next(new ErrorUnique(message.DATA_EXISTS));
      } else {
        next(err);
      }
    });
};

module.exports.deleteArticle = (req, res, next) => {
  Article.findById(req.params.articleId).select('+owner')
    .orFail(() => {
      throw new NotFoundError(message.NOTFOUND_RESURS);
    })
    .then((article) => {
      if (!article.owner.equals(req.user._id)) {
        throw new ErrorForbidden(message.NOT_ACCSES);
      }
      Article.findByIdAndRemove(req.params.articleId)
        .then((art) => {
          res.status(200).send({ message: message.ART_DELETE, art });
        })
        .catch(next);
    })
    .catch(next);
};
