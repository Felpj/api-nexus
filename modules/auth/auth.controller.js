// auth.controller.js
const express = require('express');
const router = express.Router();
const AuthService = require('./auth.service');
const { loginValidation } = require('./auth.validation');

// Rota de login
router.post('/login', async (req, res) => {
  try {
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const token = await AuthService.login(req.body);
    res.header('Authorization', token).send({ token });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = router;
