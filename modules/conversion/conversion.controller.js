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
    const userId = req.user.id; // Certifique-se de que o middleware de autenticação está populando req.user
    const { cryptoCurrency, amount } = req.body;

    // Log para verificar os dados recebidos
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
    const userId = req.user.id; // Obtém o ID do usuário logado
    const { page = 1, limit = 10 } = req.query; // Parâmetros de paginação opcionais

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
    // Passo 1: Obter o userId do token JWT
    const userId = req.user.id; // req.user deve estar preenchido pelo middleware de autenticação

    // Passo 2: Obter cryptoCurrency e amount do corpo da requisição
    const { cryptoCurrency, amount } = req.body;

    // Validação dos parâmetros de entrada
    if (!userId || !cryptoCurrency || !amount) {
      throw new Error('Parâmetros insuficientes. Certifique-se de que cryptoCurrency e amount foram informados.');
    }

    console.log('Iniciando fluxo de conversão:', { userId, cryptoCurrency, amount });

    // Passo 3: Obter as taxas de câmbio usando CoinGeckoAPI
    const rates = await CoinGeckoAPI.getCurrentPrice(cryptoCurrency, ['brl', 'usd']);
    if (!rates || !rates[cryptoCurrency]) {
      throw new Error('Não foi possível obter as taxas de câmbio.');
    }

    const brlRate = rates[cryptoCurrency].brl;
    const usdRate = rates[cryptoCurrency].usd;

    // Passo 4: Calcular os valores convertidos
    const convertedValueBRL = amount * brlRate;
    const convertedValueUSD = amount * usdRate;

    console.log('Taxas obtidas:', { brlRate, usdRate });
    console.log('Valores convertidos:', { convertedValueBRL, convertedValueUSD });

    // Passo 5: Criar a transação no banco e salvar a conversão
    const transaction = await sequelize.transaction();
    try {
      // Criar conversão no banco de dados
      const conversion = await Conversion.create({
        userId,
        cryptoCurrency,
        amount,
        convertedValueBRL,
        convertedValueUSD,
        conversionDate: new Date(),
      }, { transaction });

      console.log('Conversão salva no banco de dados:', conversion);

      // Passo 6: Registrar a conversão no histórico do usuário
      const historyData = {
        userId,
        cryptoCurrency,
        quantity: amount,
        convertedValueBRL,
        convertedValueUSD,
        timestamp: new Date(),
      };

      await historyService.createHistoryEntry(historyData, transaction);

      // Commit da transação
      await transaction.commit();

      console.log('Conversão registrada com sucesso no histórico.');

      // Passo 7: Retornar os dados da conversão
      return res.status(200).json({
        message: 'Conversão realizada com sucesso',
        data: {
          convertedValueBRL,
          convertedValueUSD,
        },
      });

    } catch (error) {
      // Caso haja algum erro, desfaz a transação
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
