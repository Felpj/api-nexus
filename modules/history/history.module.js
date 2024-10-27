// modules/history.module.js

const express = require('express');
const router = express.Router();
const historyController = require('./history.controller');
const authMiddleware = require('../../common/middleware/auth.middleware'); // Middleware de autenticação

// Rota para registrar conversão no histórico (chamada automaticamente pelo módulo de conversão)
router.post('/history', authMiddleware, historyController.createHistory);

// Rota para listar o histórico de um usuário
router.get('/history', authMiddleware, historyController.getUserHistory);

module.exports = router;
