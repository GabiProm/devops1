const Joi = require('joi');

// Esquema para registro
const esquemaRegistro = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

// Esquema para login
const esquemaLogin = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

module.exports = {
  esquemaRegistro,
  esquemaLogin
};