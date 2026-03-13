const { Joi, celebrate } = require('celebrate');
const validator = require('validator');

// Validación personalizada para URLs
const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error('string.uri');
};

// Esquema para validar un enlace
const linkValidation = Joi.string().required().custom(validateURL);

// Ejemplo de validación para un recurso "cards"
const createCardValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: linkValidation, // Validar con el esquema personalizado
  }),
});

module.exports = {
  createCardValidation,
};
