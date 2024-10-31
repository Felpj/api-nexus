// modules/history.module.js

const express = require('express');
const router = express.Router();
const historyController = require('./history.controller');
const authMiddleware = require('../../common/middleware/auth.middleware'); // Middleware de autenticação

router.post('/history', authMiddleware, historyController.createHistory);
router.get('/history', authMiddleware, historyController.getUserHistory);

module.exports = router;
