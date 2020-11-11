require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const { celebrate, Joi } = require('celebrate');
const helmet = require('helmet');
const articleRoutes = require('./routes/articles');
const userRoutes = require('./routes/users');
const UserController = require('./controllers/users');
const authMiddleware = require('./middlewares/auth');
const errorMiddleware = require('./middlewares/error');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const ProperTyError = require('./utils/propertyError');
const rateLimiter = require('./utils/rateLimiter');

const {
  MONGO_HOST = 'mongodb://localhost',
  MONGO_PORT = 27017,
  MONGO_DB_NAME = 'newsexplorer',
  PORT = 3000,
} = process.env;
const app = express();

mongoose.connect(`${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB_NAME}`, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

const loginValidateSchema = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
};
const registerValidationSchema = {
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    about: Joi.string().min(2).max(30),
  }),
};

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(rateLimiter);
app.use(cors());
app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signup', celebrate(registerValidationSchema), UserController.createUser);
app.post('/signin', celebrate(loginValidateSchema), UserController.login);

app.use(authMiddleware);
app.use('/articles', articleRoutes);
app.use('/users', userRoutes);

app.use((req, res, next) => next(new ProperTyError('NotFound', 'Запрашиваемый ресурс не найден')));
app.use(errorLogger);
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`App listening port ${PORT}`);
});
