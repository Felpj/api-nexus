// conversion/conversion.service.js
const axios = require('axios');
const  Conversion  = require('./conversion.model');
const CoinGeckoAPI = require('../../utils/coinGeckoAPI');

class ConversionService {
  /**
   * Realiza a conversão da criptomoeda para BRL e USD.
   * @param {Object} params - Parâmetros para a conversão.
   * @param {number} params.userId - ID do usuário.
   * @param {string} params.cryptoCurrency - Criptomoeda selecionada.
   * @param {number} params.amount - Quantidade a ser convertida.
   * @returns {Object} - Dados da conversão realizada.
   */
  async performConversion({ userId, cryptoCurrency, amount }) {
    try {
      // Validar entradas
      if (!cryptoCurrency || !amount || amount <= 0) {
        throw new Error('Criptomoeda e quantidade válidas são necessárias.');
      }

      // Obter taxas de câmbio usando a CoinGeckoAPI
      const rates = await CoinGeckoAPI.getCurrentPrice(cryptoCurrency, ['brl', 'usd']);

      if (!rates || !rates[cryptoCurrency]) {
        throw new Error('Não foi possível obter as taxas de câmbio.');
      }

      const brlRate = rates[cryptoCurrency].brl;
      const usdRate = rates[cryptoCurrency].usd;

      // Calcular valores convertidos
      const convertedValueBRL = amount * brlRate;
      const convertedValueUSD = amount * usdRate;

      // Criar registro de conversão no banco de dados
      const conversion = await Conversion.create({
        userId,
        cryptoCurrency,
        amount,
        convertedValueBRL,
        convertedValueUSD,
        conversionDate: new Date(),
      });

      // // Registrar no histórico
      // await History.create({
      //   userId,
      //   action: 'conversion',
      //   details: `Convertido ${amount} ${cryptoCurrency.toUpperCase()} para BRL e USD.`,
      // });

      return conversion;
    } catch (error) {
      console.error('Erro no serviço de conversão:', error.message);
      throw error;
    }
  }

  
}

module.exports = new ConversionService();
