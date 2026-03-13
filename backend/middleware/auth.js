const jwt = require('jsonwebtoken');
const { NODE_ENV, JWT_SECRET } = process.env;

// Middleware de autorización
const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(403).send({ message: 'Acceso prohibido: autorización requerida' });
  }

  const token = authorization.replace('Bearer ', '');

  try {
    const payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
    req.user = payload; // Agregar el payload del token al objeto req.user
    next();
  } catch (err) {
    res.status(401).send({ message: 'Token inválido o expirado' });
  }
};

module.exports = auth;
