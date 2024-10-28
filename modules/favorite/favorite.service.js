// favorite/favorite.service.js

const Favorite = require('./favorite.model');

class FavoriteService {
  /**
   * Adiciona uma criptomoeda aos favoritos do usuário.
   * @param {number} userId - ID do usuário.
   * @param {string} cryptoSymbol - Símbolo da criptomoeda.
   * @returns {Object} - Registro do favorito criado.
   */
  async addFavorite(userId, cryptoSymbol) {
    try {
      // Verifica se a criptomoeda já está favoritada
      const existingFavorite = await Favorite.findOne({ where: { userId, cryptoSymbol } });
      if (existingFavorite) {
        throw new Error('Criptomoeda já está favoritada.');
      }

      const favorite = await Favorite.create({ userId, cryptoSymbol });
      return favorite;
    } catch (error) {
      console.error('Erro ao adicionar favorito:', error.message);
      throw error;
    }
  }

  /**
   * Remove uma criptomoeda dos favoritos do usuário.
   * @param {number} userId - ID do usuário.
   * @param {string} cryptoSymbol - Símbolo da criptomoeda.
   * @returns {boolean} - Indica se a remoção foi bem-sucedida.
   */
  async removeFavorite(userId, cryptoSymbol) {
    try {
      const deletedCount = await Favorite.destroy({ where: { userId, cryptoSymbol } });
      if (deletedCount === 0) {
        throw new Error('Criptomoeda não estava nos favoritos.');
      }
      return true;
    } catch (error) {
      console.error('Erro ao remover favorito:', error.message);
      throw error;
    }
  }

  /**
   * Recupera todas as criptomoedas favoritadas pelo usuário.
   * @param {number} userId - ID do usuário.
   * @returns {Array} - Lista de criptomoedas favoritadas.
   */
  async getFavorites(userId) {
    try {
      const favorites = await Favorite.findAll({ where: { userId } });
      return favorites.map(fav => fav.cryptoSymbol);
    } catch (error) {
      console.error('Erro ao recuperar favoritos:', error.message);
      throw error;
    }
  }
}

module.exports = new FavoriteService();
