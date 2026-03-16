const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { NODE_ENV, JWT_SECRET } = process.env;
const userOrPasswordNotFound = "Correo electrónico o contraseña incorrectos";
const NotFoundError = require("../errors/not-found");

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    next(err); // Propaga el error al middleware de manejo de errores
  }
};

const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).orFail(() => {
      const error = new Error("Usuario no encontrado");
      error.statusCode = 404;
      throw error;
    });
    res.status(200).send(user);
  } catch (err) {
    next(err); // Propaga el error al middleware de manejo de errores
  }
};

const updateUser = async (req, res, next) => {
  const { name, about } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true },
    ).orFail(() => {
      throw new NotFoundError("Usuario no encontrado");
    });
    res.send(user);
  } catch (err) {
    next(err);
  }
};

const updateAvatar = async (req, res, next) => {
  const { avatar } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true, runValidators: true },
    ).orFail(() => {
      throw new NotFoundError("Usuario no encontrado");
    });
    res.send(user);
  } catch (err) {
    next(err);
  }
};

const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).orFail(() => {
      throw new NotFoundError(
        "No se encuentra el usuario o contraseña en la base de datos",
      );
    });
    res.status(200).send(user);
  } catch (err) {
    next(err);
  }
};

const createUser = async (req, res, next) => {
  const { name, about, avatar, email, password } = req.body;

  try {
    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    });

    const userObj = user.toObject();
    delete userObj.password;

    res.status(201).send(userObj);
  } catch (err) {
    if (err.code === 11000) {
      err.statusCode = 409;
      err.message = "El correo electrónico ya está en uso";
    }

    next(err);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      const error = new Error(userOrPasswordNotFound);
      error.statusCode = 401;
      throw error;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const error = new Error(userOrPasswordNotFound);
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign(
      { _id: user._id },
      NODE_ENV === "production" ? JWT_SECRET : "dev-secret",
      { expiresIn: "7d" },
    );

    res.status(200).send({ token });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getUsers,
  getUser,
  getCurrentUser,
  createUser,
  updateUser,
  updateAvatar,
  login,
};
