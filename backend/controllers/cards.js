const http2 = require('node:http2');
const card = require('../models/card');
const ResourceNotFoundError = require('../class/ResourceNotFoundError');
const BadRequestError = require('../class/BadRequestError');
const ForbiddenError = require('../class/ForbiddenError');

const {
  HTTP_STATUS_OK,
  HTTP_STATUS_CREATED,
} = http2.constants;

const getCards = (req, res, next) => {
  card.find({})
    .then((cards) => res.status(HTTP_STATUS_OK).json(cards))
    .catch((err) => {
      next(err);
    });
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  card.create({ name, link, owner })
    .then((addCard) => res.status(HTTP_STATUS_CREATED).json(addCard))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  card.findById(cardId)
    .then((foundCard) => {
      if (!foundCard) {
        throw new ResourceNotFoundError('Карточка с указанным _id не найдена');
      }

      if (foundCard.owner.toString() !== userId) {
        throw new ForbiddenError('Вы не можете удалить чужую карточку');
      }
      return card.deleteOne({ _id: cardId });
    })
    .then(() => res.status(HTTP_STATUS_OK).json({ message: 'Карточка удалена' }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ResourceNotFoundError('Передан несуществующий _id'));
      } else {
        next(err);
      }
    });
};

// Поставить лайк карточке
const likeCard = (req, res, next) => {
  card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((getLikeCard) => {
      if (getLikeCard) {
        res.status(HTTP_STATUS_OK).json(getLikeCard);
      } else {
        throw new ResourceNotFoundError('Карточка с указанным _id не найдена');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Передан несуществующий _id'));
      } else {
        next(err);
      }
    });
};

// Убрать лайк с карточки
const dislikeCard = (req, res, next) => {
  card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((getDislikeCard) => {
      if (getDislikeCard) {
        res.status(HTTP_STATUS_OK).json(getDislikeCard);
      } else {
        throw new ResourceNotFoundError('Карточка с указанным _id не найдена');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Передан несуществующий _id'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
};
