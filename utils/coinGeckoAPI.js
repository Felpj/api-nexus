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
 * Obtém a lista dos nomes das criptomoedas disponíveis para conversão.
 * @param {string} vsCurrency - Moeda fiduciária de referência (ex: 'usd').
 * @returns {Promise<string[]>} - Lista de nomes das criptomoedas disponíveis.
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

    // Filtrar apenas os nomes das criptomoedas
    const data = response.data.map(coin => coin.name);

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
