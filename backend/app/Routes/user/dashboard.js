const express = require("express");
const Route = express.Router();
const Controller = require("../../Controllers/userController");
const jwt = require("../../helper/jwtHelpper");

Route.get("/dashboard/users", jwt.userAuth, Controller.Dashboard.getAllUser);
Route.get("/dashboard/table", jwt.userAuth, Controller.Dashboard.getTableData);
Route.post(
  "/dashboard/generateDummyData",
  jwt.userAuth,
  Controller.Dashboard.generateDummyData
);

module.exports = Route;
