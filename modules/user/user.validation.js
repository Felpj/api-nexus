// user.validation.js
const Joi = require('joi');

// Validação de registro
const registerValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required().messages({
      'string.empty': 'O nome é obrigatório.',
      'string.min': 'O nome deve ter no mínimo 3 caracteres.',
      'string.max': 'O nome deve ter no máximo 50 caracteres.',
    }),
    email: Joi.string().email().required().messages({
      'string.empty': 'O email é obrigatório.',
      'string.email': 'O email deve ser válido.',
    }),
    password: Joi.string().min(6).required().messages({
      'string.empty': 'A senha é obrigatória.',
      'string.min': 'A senha deve ter no mínimo 6 caracteres.',
    }),
  });
  return schema.validate(data);
};

// Validação de atualização de perfil
const updateValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).messages({
      'string.min': 'O nome deve ter no mínimo 3 caracteres.',
      'string.max': 'O nome deve ter no máximo 50 caracteres.',
    }),
    email: Joi.string().email().messages({
      'string.email': 'O email deve ser válido.',
    }),
    password: Joi.string().min(6).messages({
      'string.min': 'A senha deve ter no mínimo 6 caracteres.',
    }),
  });
  return schema.validate(data);
};

module.exports = { registerValidation, updateValidation };
