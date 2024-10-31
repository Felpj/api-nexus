// routes/conversion.routes.js
const express = require('express');
const router = express.Router();
const ConversionController = require('./conversion.controller');
const authenticate = require('../../common/middleware/auth.middleware'); // Middleware de autenticação

router.post('/convert', authenticate, ConversionController.convert);
router.get('/history', authenticate, ConversionController.getHistory);
router.post('/flow', authenticate, ConversionController.executeConversionFlow);

module.exports = router;
