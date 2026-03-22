const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
let cors = require("cors");
const { errors } = require("celebrate");

require("dotenv").config();

const allowedOrigins = [
  "https://around.kje.us",
  "http://localhost:3000",
  "https://api.around.kje.us",
  "http://localhost:5173",
];
var corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      var msg =
        "The CORS policy for this site does not " +
        "allow access from the specified Origin.";
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

const routesUsers = require("./routes/users");
const routesCards = require("./routes/cards");
const { signin, createUser } = require("./controllers/users");
const auth = require("./middleware/auth");
const { createUserValidation } = require("./middleware/validators");
const { requestLogger, errorLogger } = require("./utils/logger");

const app = express();
const {
  PORT = 3000,
  DB_ADDRESS = "mongodb://127.0.0.1:27017/web_project_around_full",
} = process.env;

app.use(express.json());

mongoose.connect(DB_ADDRESS);

app.use(
  cors({
    origin: corsOptions,
    credentials: true,
  }),
);

app.use(requestLogger); // logger de peticiones

app.use(express.static(path.join(__dirname, "public")));

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("El servidor va a caer");
  }, 0);
});

app.post("/signin", signin);
app.post("/signup", createUserValidation, createUser);

app.use(auth);

app.use("/", routesUsers);
app.use("/", routesCards);

app.use(errorLogger);

app.use(errors());

// Middleware para rutas no encontradas
app.use((req, res, next) => {
  const error = new Error("Recurso solicitado no encontrado");
  error.statusCode = 404;
  next(error);
});

// Middleware genérico para manejo de errores
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).json({
    message: statusCode === 500 ? "Error interno del servidor" : message,
  });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}...`);
});
