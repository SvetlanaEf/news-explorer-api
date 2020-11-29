const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const mongoose = require('mongoose');
const { isURL } = require('validator');
const controller = require('../controllers/articles');

const linkValidate = () => Joi.string().required().custom((value, helpers) => {
  if (!isURL(value)) {
    return helpers.message({ custom: 'Некорректная ссылка на статью' });
  }

  return value;
});

router.get('/', controller.get);
router.post('/', celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required(),
    title: Joi.string().required(),
    text: Joi.string().required(),
    date: Joi.string().required(),
    source: Joi.string().required(),
    link: linkValidate(),
    image: linkValidate(),
  }),
}), controller.create);

router.delete('/:articleId', celebrate({
  params: Joi.object().keys({
    articleId: Joi.string().custom((value, helpers) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.message({ custom: 'Некорректный идентификатор' });
      }

      return value;
    }),
  }),
}), controller.delete);

module.exports = router;
