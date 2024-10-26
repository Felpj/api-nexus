// modules/user/user.controller.js
const express = require('express');
const router = express.Router();
const UserService = require('./user.service');
const { registerValidation, updateValidation } = require('./user.validation');
const authenticate = require('../../common/middleware/auth.middleware');

// Registro de usuário
router.post('/register', async (req, res) => {
  try {
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const user = await UserService.createUser(req.body);
    res.status(201).json({ message: 'Usuário registrado com sucesso', user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obter perfil do usuário
router.get('/profile', authenticate, async (req, res) => {
  try {
    const user = await UserService.getUserById(req.user.id);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Atualizar perfil do usuário
router.put('/profile', authenticate, async (req, res) => {
  try {
    const { error } = updateValidation(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const user = await UserService.updateUser(req.user.id, req.body);
    res.json({ message: 'Perfil atualizado com sucesso', user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
