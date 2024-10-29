// routes/conversion.routes.js
const express = require('express');
const router = express.Router();
const ConversionController = require('./conversion.controller');
const authenticate = require('../../common/middleware/auth.middleware'); // Middleware de autenticação

// Rota para realizar a conversão
router.post('/convert', authenticate, ConversionController.convert);
router.get('/history', authenticate, ConversionController.getHistory);
router.post('/flow', authenticate, ConversionController.executeConversionFlow);

// Exportar as rotas
module.exports = router;
