// favorite/favorite.controller.js

const FavoriteService = require('./favorite.service');

/**
 * Controlador para gerenciar favoritos de criptomoedas.
 */
class FavoriteController {
  /**
   * Favorita uma criptomoeda.
   * Endpoint: POST /favorite
   * Body: { "cryptoSymbol": "BTC" }
   */
  async favoriteCrypto(req, res) {
    try {
      const userId = req.user.id;
      const { cryptoSymbol } = req.body;

      if (!cryptoSymbol) {
        return res.status(400).json({ error: 'O símbolo da criptomoeda é obrigatório.' });
      }

      const favorite = await FavoriteService.addFavorite(userId, cryptoSymbol.toUpperCase());

      res.status(201).json({
        message: 'Criptomoeda favoritada com sucesso.',
        data: favorite,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * Desfavorita uma criptomoeda.
   * Endpoint: DELETE /favorite
   * Body: { "cryptoSymbol": "BTC" }
   */
  async unfavoriteCrypto(req, res) {
    try {
      const userId = req.user.id;
      const { cryptoSymbol } = req.body;

      if (!cryptoSymbol) {
        return res.status(400).json({ error: 'O símbolo da criptomoeda é obrigatório.' });
      }

      await FavoriteService.removeFavorite(userId, cryptoSymbol.toUpperCase());

      res.status(200).json({
        message: 'Criptomoeda desfavoritada com sucesso.',
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * Recupera as criptomoedas favoritadas pelo usuário.
   * Endpoint: GET /favorite
   */
  async getFavorites(req, res) {
    try {
      const userId = req.user.id;
      const favorites = await FavoriteService.getFavorites(userId);

      res.status(200).json({
        message: 'Favoritos recuperados com sucesso.',
        data: favorites,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new FavoriteController();
