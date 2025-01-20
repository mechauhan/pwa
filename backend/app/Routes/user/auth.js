const express = require("express");
const Route = express.Router();
const Controller = require("../../Controllers/userController");
const userValidation = require("../../Validation/user");

Route.post("/auth/register", Controller.Auth.register);
Route.post("/auth/login", Controller.Auth.login);
// Route.get("/auth/users", Controller.Auth.getAllUser);

module.exports = Route;
