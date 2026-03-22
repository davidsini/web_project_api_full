const ForbiddenError = require("../errors/forbidden-error");
const InvalidCredentials = require("../errors/invalid-credentials");
const NotFound = require("../errors/not-found");
const Card = require("../models/card");

const handlerError = () => {
  const error = new Error("Card not found");
  error.statusCode = 404;
  throw error;
};

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) => res.status(500).send({ message: err.message }));
};

const getCard = (req, res) => {
  Card.findById(req.params._id)
    .orFail(() => handlerError())
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(400).send({ message: err.message });
      } else if (err.statusCode === 404) {
        res.status(404).send({ message: err.message });
      } else {
        res
          .status(500)
          .send({ message: err.message || "error interno del servidor" });
      }
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => handlerError())
    .then((card) => {
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(400).send({ message: err.message });
      } else if (err.statusCode === 404) {
        res.status(404).send({ message: err.message });
      } else {
        res
          .status(500)
          .send({ message: err.message || "error interno del servidor" });
      }
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => handlerError())
    .then((card) => {
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(400).send({ message: err.message });
      } else if (err.statusCode === 404) {
        res.status(404).send({ message: err.message });
      } else {
        res
          .status(500)
          .send({ message: err.message || "error interno del servidor" });
      }
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(400).send({ message: err.message });
      } else {
        res.status(500).send({ message: "Error interno del servidor" });
      }
    });
};

const deleteCard = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;

  try {
    const card = await Card.findById(id).orFail(() => {
      throw new NotFound("Tarjeta no encontrada");
    });

    // if (card.owner.equals(userId)) {
    //   throw new ForbiddenError("No tienes permiso para borrar esta tarjeta");
    // }

    await Card.findByIdAndDelete(id);
    res.send({ message: "tarjeta eliminada" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getCards,
  getCard,
  likeCard,
  createCard,
  deleteCard,
  dislikeCard,
};
