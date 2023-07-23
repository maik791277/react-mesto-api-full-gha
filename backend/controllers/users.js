const http2 = require('node:http2');
const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const user = require('../models/user');
const ResourceNotFoundError = require('../class/ResourceNotFoundError');
const ConflictError = require("../class/ResourceNotFoundError");
const BadRequestError = require("../class/BadRequestError");
const UnauthorizedError = require("../class/UnauthorizedError");

const {
  HTTP_STATUS_OK,
  HTTP_STATUS_CREATED,
} = http2.constants;

// Получить всех пользователей
const getUsers = (req, res, next) => {
  user.find({})
    .then((users) => res.status(HTTP_STATUS_OK).json(users))
    .catch((err) => {
      next(err);
    });
};

const getUserById = (req, res, next) => {
  const { userId } = req.params;

  user.findById(userId)
    .then((getUserId) => {
      if (!getUserId) {
        throw new ResourceNotFoundError('Пользователь по указанному _id не найден');
      }
      return res.status(HTTP_STATUS_OK).json(getUserId);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Передан несуществующий _id'));
      } else {
        next(err);
      }
    });
};

// Создать пользователя
const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => user.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((addUser) => {
      // Исключаем поле "password" из ответа
      const userWithoutPassword = {
        _id: addUser._id,
        name: addUser.name,
        about: addUser.about,
        avatar: addUser.avatar,
        email: addUser.email,
      };
      res.status(HTTP_STATUS_CREATED).json(userWithoutPassword);
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('Пользователь с таким email уже существует'));
      } else if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

const updateProfile = (req, res, next) => {
  const { name, about } = req.body;

  user.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((updateUser) => {
      if (updateUser) {
        res.status(HTTP_STATUS_OK).json(updateUser);
      } else {
        throw new ResourceNotFoundError('Пользователь по указанному _id не найден');
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  user.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((updateAvatarUser) => {
      if (updateAvatarUser) {
        res.status(HTTP_STATUS_OK).json(updateAvatarUser);
      } else {
        throw new ResourceNotFoundError('Пользователь по указанному _id не найден');
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

const getUserInfo = (req, res, next) => {
  const userId = req.user._id;

  user.findById(userId)
    .then((getUserId) => {
      if (!getUserId) {
        throw new ResourceNotFoundError('Пользователь по указанному _id не найден');
      }
      return res.status(HTTP_STATUS_OK).json(getUserId);
    })
    .catch((err) => {
      next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  user.findOne({ email }).select('+password')
    .then((users) => {
      if (!users) {
        throw new UnauthorizedError('Неправильная почта или пароль');
      }

      return bcrypt.compare(password, users.password)
        .then((matched) => {
          if (!matched) {
            throw new UnauthorizedError('Неправильная почта или пароль');
          }

          const tokenPayload = { _id: users._id };
          const token = jwt.sign(tokenPayload, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
          res.cookie('token', token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: 'None',
            secure: true,
          });

          return res.status(HTTP_STATUS_OK).json({ message: 'Успешный вход' });
        });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getUsers, createUser, updateProfile, updateAvatar, getUserInfo, login, getUserById,
};
