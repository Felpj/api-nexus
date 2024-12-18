// utils/coinGeckoAPI.js

const axios = require('axios');
const NodeCache = require('node-cache');

class CoinGeckoAPI {
  constructor() {
    this.baseURL = 'https://api.coingecko.com/api/v3';
    this.timeout = 5000; 
    this.cache = new NodeCache({ stdTTL: 60 }); 

    this.apiKey = process.env.COINGECKO_API_KEY;

    this.instance = axios.create({
      baseURL: this.baseURL,
      timeout: this.timeout,
      headers: {
        'Content-Type': 'application/json',
        'X-CG-APIKEY': this.apiKey, // Incluindo a chave da API no cabeçalho
      },
    });
  }

  /**
   * Obtém os preços atuais das criptomoedas especificadas em relação às moedas fiduciárias desejadas.
   * @param {string|string[]} cryptoIds - ID(s) da(s) criptomoeda(s) (ex: 'bitcoin' ou ['bitcoin', 'ethereum'])
   * @param {string|string[]} vsCurrencies - Moeda(s) fiduciária(s) (ex: 'usd' ou ['usd', 'brl'])
   * @returns {Promise<Object>} - Preços atuais das criptomoedas solicitadas
   */
  async getCurrentPrice(cryptoIds, vsCurrencies) {
    try {
      const ids = Array.isArray(cryptoIds) ? cryptoIds.join(',') : cryptoIds;
      const vs = Array.isArray(vsCurrencies) ? vsCurrencies.join(',') : vsCurrencies;

      const cacheKey = `price_${ids}_${vs}`;
      const cachedData = this.cache.get(cacheKey);

      if (cachedData) {
        console.log(`Dados de preço encontrados no cache para: ${cacheKey}`);
        return cachedData;
      }

      console.log(`Fazendo requisição para CoinGecko: ${ids} vs ${vs}`);
      const response = await this.instance.get('/simple/price', {
        params: {
          ids,
          vs_currencies: vs,
        },
      });

      const data = response.data;

      this.cache.set(cacheKey, data);
      console.log(`Dados de preço armazenados no cache para: ${cacheKey}`);

      return data;
    } catch (error) {
      console.error('Erro ao obter preços atuais:', error.message);
      throw new Error('Não foi possível obter os preços atuais das criptomoedas.');
    }
  }

 /**
 * Obtém a lista dos IDs, nomes e símbolos das criptomoedas disponíveis para conversão.
 * @param {string} vsCurrency - Moeda fiduciária de referência (ex: 'usd').
 * @returns {Promise<Array<{ id: string, name: string, symbol: string }>>} - Lista de criptomoedas disponíveis.
 */
async getCryptocurrenciesList(vsCurrency = 'usd') {
  try {
    const cacheKey = `cryptocurrencies_list_${vsCurrency}`;
    const cachedData = this.cache.get(cacheKey);

    if (cachedData) {
      console.log(`Dados de criptomoedas encontrados no cache para: ${cacheKey}`);
      return cachedData;
    }

    console.log(`Fazendo requisição para listar criptomoedas: ${vsCurrency}`);
    const response = await this.instance.get('/coins/markets', {
      params: {
        vs_currency: vsCurrency,
        order: 'market_cap_desc',
        per_page: 100, // Número de criptomoedas a serem retornadas (ajustável conforme necessidade)
        page: 1,
        sparkline: false,
      },
    });

    // Retornar um array de objetos com id, name e symbol
    const data = response.data.map(coin => ({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol,
    }));

    this.cache.set(cacheKey, data);
    console.log(`Dados de criptomoedas armazenados no cache para: ${cacheKey}`);

    return data;
  } catch (error) {
    console.error('Erro ao listar criptomoedas:', error.message);
    throw new Error('Não foi possível listar as criptomoedas disponíveis.');
  }
}


}

module.exports = new CoinGeckoAPI();
