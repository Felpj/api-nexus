const express = require('express');
const router = express.Router();
const db = require('../config/db');

/* GET home page. */
router.get('/', async (req, res, next) => {
  try {
    const [rows] = await db.query('SELECT 1 + 1 AS solution');
    res.json({ message: 'Conexão bem-sucedida!', solution: rows[0].solution });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao conectar no banco de dados' });
  }
});

module.exports = router;
