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

  /**
   * Recupera o histórico de conversões de um usuário com paginação.
   * @param {number} userId - ID do usuário.
   * @param {number} page - Número da página.
   * @param {number} limit - Número de registros por página.
   * @returns {Promise<Object>} - Dados paginados do histórico de conversões.
   */
  async getConversionHistory(userId, page = 1, limit = 10) {
    try {
      console.log(`Recuperando histórico para o usuário ${userId}, página ${page}, limite ${limit}`);
      
      const offset = (page - 1) * limit;
      
      const { count, rows } = await Conversion.findAndCountAll({
        where: { userId },
        order: [['conversionDate', 'DESC']],
        limit,
        offset,
      });
      
      const totalPages = Math.ceil(count / limit);
      
      return {
        totalRecords: count,
        totalPages,
        currentPage: page,
        records: rows,
      };
    } catch (error) {
      console.error('Erro ao recuperar histórico de conversões:', error.message);
      throw error;
    }
  }
  
}

module.exports = new HistoryService();
