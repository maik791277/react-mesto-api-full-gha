const express = require('express');

const router = express.Router();
const usersRouter = require('./users');
const cardsRouter = require('./cards');
const authMiddleware = require('../middlewares/auth');

router.use('/users', authMiddleware, usersRouter);
router.use('/cards', authMiddleware, cardsRouter);

module.exports = router;
