// utils/coinGeckoAPI.js

const axios = require('axios');
const NodeCache = require('node-cache');

class CoinGeckoAPI {
  constructor() {
    // Configurações padrão
    this.baseURL = 'https://api.coingecko.com/api/v3';
    this.timeout = 5000; // Tempo limite em milissegundos
    this.cache = new NodeCache({ stdTTL: 60 }); // Cache com TTL de 60 segundos

    // Obtendo a chave da API a partir das variáveis de ambiente
    this.apiKey = process.env.COINGECKO_API_KEY;

    this.instance = axios.create({
      baseURL: this.baseURL,
      timeout: this.timeout,
      headers: {
        'Content-Type': 'application/json',
        'X-CG-APIKEY': this.apiKey, // Incluindo a chave da API no cabeçalho
      },
    });

    // Opcional: Configurar retries em caso de falhas transitórias
    // Por exemplo, usando axios-retry
    // const axiosRetry = require('axios-retry');
    // axiosRetry(this.instance, { retries: 3, retryDelay: axiosRetry.exponentialDelay });
  }

  /**
   * Obtém os preços atuais das criptomoedas especificadas em relação às moedas fiduciárias desejadas.
   * @param {string|string[]} cryptoIds - ID(s) da(s) criptomoeda(s) (ex: 'bitcoin' ou ['bitcoin', 'ethereum'])
   * @param {string|string[]} vsCurrencies - Moeda(s) fiduciária(s) (ex: 'usd' ou ['usd', 'brl'])
   * @returns {Promise<Object>} - Preços atuais das criptomoedas solicitadas
   */
  async getCurrentPrice(cryptoIds, vsCurrencies) {
    try {
      // Converter parâmetros para string, caso sejam arrays
      const ids = Array.isArray(cryptoIds) ? cryptoIds.join(',') : cryptoIds;
      const vs = Array.isArray(vsCurrencies) ? vsCurrencies.join(',') : vsCurrencies;

      // Verificar se a resposta está em cache
      const cacheKey = `price_${ids}_${vs}`;
      const cachedData = this.cache.get(cacheKey);

      if (cachedData) {
        console.log(`Dados de preço encontrados no cache para: ${cacheKey}`);
        return cachedData;
      }

      // Fazer a requisição para a API da CoinGecko
      console.log(`Fazendo requisição para CoinGecko: ${ids} vs ${vs}`);
      const response = await this.instance.get('/simple/price', {
        params: {
          ids,
          vs_currencies: vs,
        },
      });

      const data = response.data;

      // Armazenar no cache
      this.cache.set(cacheKey, data);
      console.log(`Dados de preço armazenados no cache para: ${cacheKey}`);

      return data;
    } catch (error) {
      // Tratamento de erros
      console.error('Erro ao obter preços atuais:', error.message);
      throw new Error('Não foi possível obter os preços atuais das criptomoedas.');
    }
  }

  // Possíveis métodos futuros, como getHistoricalPrice, etc.
}

module.exports = new CoinGeckoAPI();
