// auth.module.js
const express = require('express');
const router = express.Router();
const AuthController = require('./auth.controller');

// Configurar rotas de autenticação
router.use('/', AuthController);

module.exports = router;
