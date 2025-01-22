const express = require("express");
const Route = express.Router();
const Controller = require("../../Controllers/userController");
const jwt = require("../../helper/jwtHelpper");

Route.get("/dashboard/users", Controller.Dashboard.getAllUser);
Route.get("/dashboard/table", Controller.Dashboard.getTableData);
Route.post(
  "/dashboard/generateDummyData",
  Controller.Dashboard.generateDummyData
);

module.exports = Route;
