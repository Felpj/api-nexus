// controllers/cryptocurrencies.controller.js

const express = require('express');
const router = express.Router();
const CoinGeckoAPI = require('./coinGeckoAPI');

// Endpoint para listar criptomoedas disponíveis
router.get('/', async (req, res) => {
  try {
    const vsCurrency = req.query.vs_currency || 'usd';
    const cryptocurrencies = await CoinGeckoAPI.getCryptocurrenciesList(vsCurrency);
    res.status(200).json(cryptocurrencies);
  } catch (error) {
    console.error('Erro ao listar criptomoedas:', error.message);
    res.status(500).json({ error: 'Não foi possível listar as criptomoedas disponíveis.' });
  }
});

module.exports = router;
