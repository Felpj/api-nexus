// controllers/history.controller.js

const historyService = require('./history.service');

// Registrar conversão no histórico
const createHistory = async (req, res) => {
  try {
    const { userId, cryptoCurrency, quantity, convertedValueBRL, convertedValueUSD } = req.body;
    const newEntry = await historyService.createHistoryEntry({
      userId,
      cryptoCurrency,
      quantity,
      convertedValueBRL,
      convertedValueUSD,
      timestamp: new Date(),
    });
    res.status(201).json({ message: 'Conversão registrada com sucesso', data: newEntry });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obter histórico de um usuário
const getUserHistory = async (req, res) => {
  try {
    const userId = req.user.id; // ID do usuário autenticado
    const { filter, order } = req.query; // Filtragem e ordenação

    const filters = {}; // Adicione lógicas de filtro específicas aqui
    const orderConfig = order ? [order.split(',')] : [['timestamp', 'DESC']]; // Ordenação por padrão

    const history = await historyService.getUserHistory(userId, filters, orderConfig);

    if (history.length === 0) {
      return res.status(404).json({ message: 'Nenhum registro encontrado' });
    }

    res.status(200).json({ message: 'Histórico recuperado com sucesso', data: history });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createHistory,
  getUserHistory,
};
