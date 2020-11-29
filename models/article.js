const mongoose = require('mongoose');
const PropertyError = require('../utils/propertyError');

const articleSchema = new mongoose.Schema({
  keyword: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: [true, 'Ссылка - обязательное поле'],
    validate: {
      validator: (v) => /http(s)?:\/\/([0-9a-z.-]*)\.([0-9a-z]){2,5}(\/([a-z])*)*/gi.test(v),
      message: () => 'Ссылка не корректна',
    },
  },
  image: {
    type: String,
    required: [true, 'Ссылка - обязательное поле'],
    validate: {
      validator: (v) => /http(s)?:\/\/([0-9a-z.-]*)\.([0-9a-z]){2,5}(\/([a-z])*)*/gi.test(v),
      message: () => 'Ссылка не корректна',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
});

/* eslint-disable-next-line */
articleSchema.statics.deleteByOwner = function(articleId, ownerId) {
  return this.findOne({ _id: articleId })
    .select('+owner')
    .then((article) => {
      if (!article) {
        return Promise.reject(new PropertyError('NotFound', 'Статья не найдена'));
      }

      if (article.owner.toString() !== ownerId) {
        return Promise.reject(new PropertyError('ForbiddenError', 'Вы не можете удалить чужую статью'));
      }

      return article.remove();
    });
};

module.exports = mongoose.model('article', articleSchema);
