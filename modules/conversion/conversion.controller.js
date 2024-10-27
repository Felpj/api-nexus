// modules/conversion/conversion.controller.js

const conversionService = require('./conversion.service');

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

    const historyData = await conversionService.getConversionHistory(userId, parseInt(page), parseInt(limit));

    res.status(200).json({
      message: 'Histórico de conversões recuperado com sucesso',
      data: historyData,
    });
  } catch (error) {
    console.error('Erro ao recuperar o histórico de conversões:', error.message);
    res.status(500).json({ error: error.message });
  }
}

module.exports = { convert };
