const Article = require('../models/article');

module.exports.get = (req, res, next) => {
  Article.find({ owner: req.user._id })
    .then((articles) => res.send({ data: articles }))
    .catch(next);
};

module.exports.create = (req, res, next) => {
  const {
    keyword,
    title,
    text,
    date,
    source,
    link,
    image,
  } = req.body;

  Article
    .create({
      keyword,
      title,
      text,
      date,
      source,
      link,
      image,
      owner: req.user._id,
    })
    .then((article) => res.send({ data: article }))
    .catch(next);
};

module.exports.delete = (req, res, next) => {
  Article
    .deleteByOwner(req.params.articleId, req.user._id)
    .then((result) => res.send({ data: result }))
    .catch(next);
};
