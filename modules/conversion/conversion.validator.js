// validators/conversion.validator.js
const Joi = require('joi');

const conversionSchema = Joi.object({
  cryptoCurrency: Joi.string().required(),
  amount: Joi.number().positive().required(),
});

module.exports = {
  conversionSchema,
};
