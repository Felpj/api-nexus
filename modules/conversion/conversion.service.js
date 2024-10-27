// modules/conversion/conversion.service.js

const Conversion = require('./conversion.model'); 
const CoinGeckoAPI = require('../../utils/coinGeckoAPI'); 
const historyService = require('../history/history.service'); 
const sequelize = require('../../config/db'); 

class ConversionService {
  /**
   * Realiza a conversão da criptomoeda para BRL e USD.
   * @param {Object} params - Parâmetros para a conversão.
   * @param {number} params.userId - ID do usuário.
   * @param {string} params.cryptoCurrency - Criptomoeda selecionada.
   * @param {number} params.amount - Quantidade a ser convertida.
   * @returns {Object} - Dados da conversão realizada.
   */
  // modules/conversion/conversion.service.js

async performConversion({ userId, cryptoCurrency, amount }) {
  console.log('Iniciando conversão:', { userId, cryptoCurrency, amount });

  if (!amount || amount <= 0) {
    console.error('Valor de amount inválido:', amount);
    throw new Error('Quantidade inválida para conversão.');
  }

  const transaction = await sequelize.transaction();

  try {
    // Obter taxas de câmbio
    const rates = await CoinGeckoAPI.getCurrentPrice(cryptoCurrency, ['brl', 'usd']);
    if (!rates || !rates[cryptoCurrency]) {
      throw new Error('Não foi possível obter as taxas de câmbio.');
    }

    const brlRate = rates[cryptoCurrency].brl;
    const usdRate = rates[cryptoCurrency].usd;

    const convertedValueBRL = amount * brlRate;
    const convertedValueUSD = amount * usdRate;

    console.log('Valores convertidos:', { convertedValueBRL, convertedValueUSD });

    const conversion = await Conversion.create({
      userId,
      cryptoCurrency,
      amount,
      convertedValueBRL,
      convertedValueUSD,
      conversionDate: new Date(),
    }, { transaction });

    console.log('Conversão criada no banco de dados:', conversion);

    const historyData = {
      userId,
      cryptoCurrency,
      quantity: amount,
      convertedValueBRL,
      convertedValueUSD,
      timestamp: new Date(),
    };

    console.log('Dados para o histórico:', historyData);

    if (!historyData.quantity) {
      console.error('Quantidade está nula antes de criar o histórico.');
      throw new Error('Quantidade para o histórico não pode ser nula.');
    }

    await historyService.createHistoryEntry(historyData, transaction);

    await transaction.commit();
    return conversion;
  } catch (error) {
    await transaction.rollback();
    console.error('Erro no serviço de conversão:', error.message);
    throw error;
  }
}



}

module.exports = new ConversionService();
