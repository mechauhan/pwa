const path = require("path");
const express = require("express");
const morgan = require("morgan");
const createError = require("http-errors");
const cors = require("cors");
require("dotenv").config();
const { appConstant } = require("./Config/constant/appConstant");
const routes = require("./Routes");
require("./helper/redis");
// const redisClient = require("./helper/redis");

const app = express();
const middleware = [
  express.json({ type: "application/json" }),
  express.urlencoded({ extended: true }),
  express.raw(),
  express.static(path.join(__dirname, "public")),
  morgan(`dev`),
  cors(),
];

app.use(middleware);
app.use("/", routes);

app.use(async (req, res, next) => {
  next(createError.NotFound(appConstant.ROUTENOTFOUND));
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    statusCode: err.status || 500,
    message: err.message,
  });
});
const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`server is running on ${port}`));
