// conversion/conversion.controller.js
const ConversionService = require('./conversion.service');
const { conversionSchema } = require('./conversion.validator');

class ConversionController {
  /**
   * Controlador para realizar a conversão.
   * @param {Object} req - Requisição Express.
   * @param {Object} res - Resposta Express.
   */
  async convert(req, res) {
    try {
      const { error, value } = conversionSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const { cryptoCurrency, amount } = value;
      const userId = req.user.id;

      const conversion = await ConversionService.performConversion({
        userId,
        cryptoCurrency,
        amount,
      });

      return res.status(200).json({
        message: 'Conversão realizada com sucesso.',
        conversion,
      });
    } catch (error) {
      console.error('Erro no controlador de conversão:', error);
      return res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new ConversionController();
