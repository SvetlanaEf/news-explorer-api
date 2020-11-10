const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const PropertyError = require('../utils/propertyError');

const { JWT_SECRET = 'local-jwt-key' } = process.env;

module.exports.getMe = (req, res, next) => {
  User.findOne({ _id: req.user._id })
    .orFail(() => new PropertyError('NotFound', 'Пользователь не найден'))
    .then((user) => res.send({ data: { name: user.name, email: user.email } }))
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then((model) => {
      const user = model.toJSON();

      delete user.password;
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'MongoError' && err.code === 11000) {
        next(new PropertyError('ConflictError', 'Пользователь с данным email уже есть'));
      } else {
        next();
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });

      res.send({ token });
    })
    .catch((err) => next(new PropertyError('AuthError', err.message)));
};
