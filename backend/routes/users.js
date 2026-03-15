const users = require("express").Router();
const {
  getUsers,
  getCurrentUser,
  getUser,
  updateUser,
  updateAvatar,
} = require("../controllers/users");

users.get("/users", getUsers);
users.get("/users/me", getCurrentUser);
users.patch("/users/me", updateUser);
users.patch("/users/me/avatar", updateAvatar);

module.exports = users;
