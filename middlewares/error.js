const mongoose = require('mongoose');
const { isCelebrateError } = require('celebrate');
const getError = require('../utils/errorCode');
const PropertyError = require('../utils/propertyError');

module.exports = (err, req, res, next) => {
  let error = err;

  if (isCelebrateError(error)) {
    const messages = [];
    const details = Array.from(err.details.entries());

    details.forEach((joiError) => {
      if (joiError && joiError[1]) {
        messages.push(joiError[1].message);
      }
    });

    error = new PropertyError('ValidationError', messages.join(', '));
  }

  if (err instanceof mongoose.Error && error.errors) {
    const messages = [];

    Object.keys(error.errors).forEach((key) => {
      messages.push(error.errors[key].message);
    });

    error = new PropertyError('ValidationError', messages.join(', '));
  }

  const { status, message } = getError(error.name);

  res.status(status).send({ message: error instanceof PropertyError ? error.message : message });
  next();
};
