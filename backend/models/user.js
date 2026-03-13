const mongoose = require("mongoose");
const validator = require("validator");

const requiredMessage = "El campo {PATH} es obligatorio.";
const minlengthMessage =
  "El campo {PATH} debe tener al menos {MINLENGTH} caracteres.";
const maxlengthMessage =
  "El campo {PATH} debe tener como máximo {MAXLENGTH} caracteres.";
const urlMessage = "El campo {PATH} debe ser una URL válida.";
const emailMessage = "El campo {PATH} debe ser un correo válido.";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [2, minlengthMessage],
    maxlength: [30, maxlengthMessage],
    default: "Jacques Cousteau",
  },
  about: {
    type: String,
    minlength: [2, minlengthMessage],
    maxlength: [30, maxlengthMessage],
    default: "Explorador",
  },
  avatar: {
    type: String,
    validate: {
      validator: (v) =>
        validator.isURL(v, {
          protocols: ["http", "https"],
          require_protocol: true,
        }),
      message: urlMessage,
    },
    default:
      "https://practicum-content.s3.us-west-1.amazonaws.com/resources/moved_avatar_1604080799.jpg",
  },
  email: {
    type: String,
    unique: true,
    required: [true, requiredMessage],
    validate: {
      validator: (v) => validator.isEmail(v), // usar módulo de Validator para validar, valga la redundancia
      message: emailMessage,
    },
  },
  password: {
    type: String,
    unique: false,
    required: [true, requiredMessage],
    // minlength: [8, minlengthMessage],
    // maxlength: [16, maxlengthMessage],
    select: false,
  },
});

module.exports = mongoose.model("user", userSchema);
