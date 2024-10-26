// modules/user/user.module.js
const express = require('express');
const router = express.Router();
const UserController = require('./user.controller');

// Usar as rotas do controlador
router.use('/', UserController);

module.exports = router;
