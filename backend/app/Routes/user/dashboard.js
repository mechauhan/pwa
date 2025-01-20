const express = require("express");
const Route = express.Router();
const Controller = require("../../Controllers/userController");

Route.get("/dashboard/users", Controller.Dashboard.getAllUser);
Route.get("/dashboard/table", Controller.Dashboard.getTableData);

module.exports = Route;
