const Card = require('../models/card');

const handlerError = () => {
    const error = new Error('Card not found');
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
          if (err.name === 'ValidationError') {
              res.status(400).send({ message: err.message });
          } else if (err.statusCode === 404) {
              res.status(404).send({ message: err.message });
          } else {
              res.status(500).send({ message: err.message || 'error interno del servidor' });
          }
      });
};

const likeCard = (req, res) => {
    Card.findByIdAndUpdate(req.params.id, { $addToSet: { likes: req.user._id } }, { new: true })
        .orFail(() => handlerError())
        .then((card) => {
            return res.send(card);
        })
        .catch((err) => {
          if (err.name === 'ValidationError') {
            res.status(400).send({ message: err.message });
          } else if (err.statusCode === 404) {
            res.status(404).send({ message: err.message });
          } else {
            res.status(500).send({ message: err.message || 'error interno del servidor' });
          }
        });
};

const dislikeCard = (req, res) => {
    Card.findByIdAndUpdate(req.params.id, { $pull: { likes: req.user._id } }, { new: true })
        .orFail(() => handlerError())
        .then((card) => {
            return res.send(card);
        })
        .catch((err) => {
          if (err.name === 'ValidationError') {
            res.status(400).send({ message: err.message });
          } else if (err.statusCode === 404) {
            res.status(404).send({ message: err.message });
          } else {
            res.status(500).send({ message: err.message || 'error interno del servidor' });
          }
        });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
      .then((card) => res.send(card))
      .catch((err) => {
          if (err.name === 'ValidationError') {
              res.status(400).send({ message: err.message });
          } else {
              res.status(500).send({ message: 'Error interno del servidor' });
          }
      });
};

const deleteCard = (req, res) => {
  const { id } = req.params; // ID de la tarjeta
  const userId = req.user._id; // ID del usuario desde el token

  // Buscar la tarjeta por su ID
  Card.findById(id)
    .orFail(() => {
      const error = new Error('Tarjeta no encontrada');
      error.statusCode = 404;
      throw error;
    })
    .then((card) => {
      // Verificar si el usuario es el propietario de la tarjeta
      if (card.owner.toString() !== userId) {
        const error = new Error('No puedes borrar tarjetas de otros usuarios');
        error.statusCode = 403;
        throw error;
      }

      // Si el usuario es el propietario, borrar la tarjeta
      return Card.findByIdAndDelete(id);
    })
    .then((deletedCard) => res.status(200).send(deletedCard))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: err.message });
      } else if (err.statusCode === 404) {
        res.status(404).send({ message: err.message });
      } else if (err.statusCode === 403) {
        res.status(403).send({ message: err.message });
      } else {
        res.status(500).send({ message: err.message || 'error interno del servidor' });
      }
    });
};


module.exports = {
    getCards,
    getCard,
    likeCard,
    createCard,
    deleteCard,
    dislikeCard
};