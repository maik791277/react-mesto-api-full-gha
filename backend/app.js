const http2 = require('node:http2');
const mongoose = require('mongoose');
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
const { createUser, login } = require('./controllers/users');
const { errorMiddleware } = require('./middlewares/error');
const routes = require('./routes');
const { ClientError } = require('./class/ClientError');
const { requestLogger, errorLogger } = require('./middlewares/logger');
require('dotenv').config();

const {
  HTTP_STATUS_NOT_FOUND,
} = http2.constants;

const {
  PORT = 3000,
  MONGO_URL = 'mongodb://127.0.0.1:27017',
} = process.env;
const app = express();

// app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());

app.use(express.json());
app.use(requestLogger);

mongoose.connect(`${MONGO_URL}/mestodb`, { useUnifiedTopology: true });

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).optional(),
    about: Joi.string().min(2).max(30).optional(),
    avatar: Joi.string().uri().regex(/^(https?:\/\/)?(www\.)?[-a-zA-Z0-9._~:/?#[\]@!$&'()*+,;=]+#?$/).optional(),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), createUser);

app.get('/error', (req, res, next) => {
  const error = new Error('Произошла ошибка');
  next(error);
});

app.use(cookieParser());
app.use('/', routes);
app.use(errorLogger);
app.use(errors());
app.use((req, res, next) => next(new ClientError('Страница не найдена', HTTP_STATUS_NOT_FOUND)));
app.use(errorMiddleware);

app.listen(PORT);
