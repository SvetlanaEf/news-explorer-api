const jwt = require('jsonwebtoken');
const PropertyError = require('../utils/propertyError');

const { JWT_SECRET = 'local-jwt-key' } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new PropertyError('AuthError', 'Необходима авторизация'));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return next(new PropertyError('AuthError', 'Необходима авторизация'));
  }

  req.user = payload;
  return next();
};
