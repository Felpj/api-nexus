// favorite/favorite.module.js

const express = require('express');
const router = express.Router();
const FavoriteController = require('./favorite.controller');
const authMiddleware = require('../../common/middleware/auth.middleware'); // Ajuste o caminho conforme sua estrutura

// Aplicar o middleware de autenticação a todas as rotas deste módulo
router.use(authMiddleware);

router.post('/', FavoriteController.favoriteCrypto);
router.delete('/', FavoriteController.unfavoriteCrypto);
router.get('/', FavoriteController.getFavorites);

module.exports = router;
