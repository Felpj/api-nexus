// modules/history/history.service.js

const ConversionHistory = require('./conversionHistory.model'); 

class HistoryService {
  /**
   * Registrar uma nova conversão no histórico.
   * @param {Object} data - Dados da conversão.
   * @param {Object} [transaction] - Transação do Sequelize (opcional).
   * @returns {Object} - Registro criado no histórico.
   */
  async createHistoryEntry(data, transaction = null) {
    console.log('Iniciando registro de histórico com dados:', data);
  
    try {
      if (data.quantity === undefined || data.quantity === null) {
        console.error('Quantidade está nula ou indefinida antes de salvar no banco:', data.quantity);
      } else {
        console.log('Quantidade válida:', data.quantity);
      }
  
      const newEntry = await ConversionHistory.create(data, { transaction });
      console.log('Registro de histórico criado:', newEntry);
      return newEntry;
    } catch (error) {
      console.error('Erro ao registrar conversão no histórico:', error.message);
      throw new Error('Erro ao registrar conversão no histórico: ' + error.message);
    }
  }
  
}

module.exports = new HistoryService();
