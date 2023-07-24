require('dotenv').config();
const mongoose = require('mongoose');
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { createUser, login } = require('./controllers/users');
const { errorMiddleware } = require('./middlewares/error');
const routes = require('./routes');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const ResourceNotFoundError = require('./class/ResourceNotFoundError');
require('dotenv').config();

const {
  PORT = 3000,
  MONGO_URL = 'mongodb://127.0.0.1:27017',
} = process.env;
const app = express();

// app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(requestLogger);

mongoose.connect(`${MONGO_URL}/mestodb`, { useUnifiedTopology: true });

const allowedOrigins = [
  'https://v-porulitsun.nomoredomains.xyz',
  'http://v-porulitsun.nomoredomains.xyz',
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

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

app.use(cookieParser());
app.use('/', routes);
app.use((req, res, next) => next(new ResourceNotFoundError('Страница не найдена')));
app.use(errorLogger);
app.use(errors());
app.use(errorMiddleware);

app.listen(PORT);
