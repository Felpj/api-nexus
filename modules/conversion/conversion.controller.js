// modules/conversion/conversion.controller.js

const conversionService = require('./conversion.service');
const CoinGeckoAPI = require('../../utils/coinGeckoAPI');
const sequelize = require('../../config/db');
const Conversion = require('./conversion.model');
const historyService = require('../history/history.service');

/**
 * Controlador para realizar uma conversão de criptomoeda.
 * @param {Object} req - Requisição HTTP.
 * @param {Object} res - Resposta HTTP.
 */
const convert = async (req, res) => {
  try {
    const userId = req.user.id; 
    const { cryptoCurrency, amount } = req.body;

    console.log('Dados recebidos no controlador:', { userId, cryptoCurrency, amount });

    const conversion = await conversionService.performConversion({ userId, cryptoCurrency, amount });

    res.status(201).json({
      message: 'Conversão realizada com sucesso',
      data: conversion,
    });
  } catch (error) {
    console.error('Erro no controlador de conversão:', error.message);
    res.status(500).json({ error: error.message });
  }

  
};

const getHistory = async (req, res) => {
  try {
    const userId = req.user.id; 
    const { page = 1, limit = 10 } = req.query; 

    console.log('Solicitação de histórico de conversões para o usuário:', userId, 'Página:', page, 'Limite:', limit);

    // Conversão para inteiros e validação
    const parsedPage = parseInt(page, 10);
    const parsedLimit = parseInt(limit, 10);

    if (isNaN(parsedPage) || isNaN(parsedLimit) || parsedPage < 1 || parsedLimit < 1) {
      return res.status(400).json({ error: 'Parâmetros de página e limite devem ser números válidos e maiores que zero.' });
    }

    const historyData = await conversionService.getConversionHistory(userId, parsedPage, parsedLimit);

    res.status(200).json({
      message: 'Histórico de conversões recuperado com sucesso',
      data: historyData,
    });
  } catch (error) {
    console.error('Erro ao recuperar o histórico de conversões:', error.message);
    res.status(500).json({ error: 'Não foi possível recuperar o histórico de conversões.' });
  }
};

/**
 * Executa o fluxo completo de conversão de criptomoedas.
 * @param {Object} req - Objeto de requisição do Express.
 * @param {Object} res - Objeto de resposta do Express.
 * @returns {Object} - Resultado da conversão.
 */
async function executeConversionFlow(req, res) {
  try {
    const userId = req.user.id; 

    const { cryptoCurrency, amount } = req.body;

    if (!userId || !cryptoCurrency || !amount) {
      throw new Error('Parâmetros insuficientes. Certifique-se de que cryptoCurrency e amount foram informados.');
    }

    console.log('Iniciando fluxo de conversão:', { userId, cryptoCurrency, amount });

    const rates = await CoinGeckoAPI.getCurrentPrice(cryptoCurrency, ['brl', 'usd']);
    if (!rates || !rates[cryptoCurrency]) {
      throw new Error('Não foi possível obter as taxas de câmbio.');
    }

    const brlRate = rates[cryptoCurrency].brl;
    const usdRate = rates[cryptoCurrency].usd;

    const convertedValueBRL = amount * brlRate;
    const convertedValueUSD = amount * usdRate;

    console.log('Taxas obtidas:', { brlRate, usdRate });
    console.log('Valores convertidos:', { convertedValueBRL, convertedValueUSD });

    const transaction = await sequelize.transaction();
    try {
      const conversion = await Conversion.create({
        userId,
        cryptoCurrency,
        amount,
        convertedValueBRL,
        convertedValueUSD,
        conversionDate: new Date(),
      }, { transaction });

      console.log('Conversão salva no banco de dados:', conversion);

      const historyData = {
        userId,
        cryptoCurrency,
        quantity: amount,
        convertedValueBRL,
        convertedValueUSD,
        timestamp: new Date(),
      };

      await historyService.createHistoryEntry(historyData, transaction);

      await transaction.commit();

      console.log('Conversão registrada com sucesso no histórico.');

      return res.status(200).json({
        message: 'Conversão realizada com sucesso',
        data: {
          convertedValueBRL,
          convertedValueUSD,
        },
      });

    } catch (error) {
      await transaction.rollback();
      console.error('Erro ao realizar conversão e registrar histórico:', error.message);
      return res.status(500).json({ error: 'Erro ao realizar conversão: ' + error.message });
    }

  } catch (error) {
    console.error('Erro no fluxo de conversão:', error.message);
    return res.status(500).json({ error: 'Erro ao processar a conversão: ' + error.message });
  }
}

module.exports = { convert, getHistory, executeConversionFlow };
