const jwt = require("jsonwebtoken");
const { NODE_ENV, JWT_SECRET } = process.env;
const InvalidCredentials = require("../errors/invalid-credentials");
const ForbiddenError = require("../errors/forbidden-error");

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).send({ message: "Se requiere autorización" });
  }

  const token = authorization.replace("Bearer ", "");

  let payload;

  try {
    payload = jwt.verify(
      token,
      NODE_ENV === "production" ? JWT_SECRET : "dev-secret",
    );
    req.user = payload;
    next();
  } catch (err) {
    next(new InvalidCredentials("Credenciales inválidas"));
  }
};

module.exports = auth;
