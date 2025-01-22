const {
  catchAsync,
  sendResponse,
  sendMessageResponse,
} = require("../../helper/common");
const error = require("http-errors");
const userServices = require("../../services/userServices/auth");
const { jwtSign } = require("../../helper/jwtHelpper");
const { config } = require("./../../Config/constant/infoConstants");
const { appConstant } = require("../../Config/constant/appConstant");
const bcrypt = require("bcryptjs");
const redisClient = require("../../helper/redis");

// Helper function to get all users from Redis
const getAllUsers = async () => {
  try {
    // Using sendCommand to fetch all keys in the "users" hash
    const keys = await redisClient.sendCommand(["HKEYS", "users"]);
    return keys;
  } catch (err) {
    throw new Error(err);
  }
};

// Helper function to get user from Redis
const getUser = async (userEmail) => {
  try {
    // Using sendCommand to get a specific field from the "users" hash
    const user = await redisClient.sendCommand(["HGET", "users", userEmail]);
    return user;
  } catch (err) {
    throw new Error(err);
  }
};

// Helper function to save user in Redis
const saveUser = async (username, hashedPassword) => {
  try {
    const result = await redisClient.sendCommand([
      "HSET",
      "users",
      username,
      hashedPassword,
    ]);
    return result;
  } catch (err) {
    throw err;
  }
};

exports.register = catchAsync(async (req, res) => {
  const { userEmail, password } = req.body;
  if (!userEmail || !password) {
    return res
      .status(400)
      .json({ error: "userEmail and password are required." });
  }
  console.log(await getAllUsers(), "getAllUsers");

  let existingUser = await getUser(userEmail);
  console.log("existingUser", existingUser);

  if (existingUser) {
    return res.status(400).json({ error: "User already exists." });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  await saveUser(userEmail, hashedPassword);

  sendMessageResponse(res, appConstant.SUCCESSREGISTER);
});

exports.login = catchAsync(async (req, res) => {
  const { userEmail, password } = req.body;
  if (!userEmail || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required." });
  }
  // Get user from Redis
  const hashedPassword = await getUser(userEmail);
  if (!hashedPassword) {
    return res.status(400).json({ error: "Invalid username or password." });
  }

  // Compare passwords
  const isMatch = await bcrypt.compare(password, hashedPassword);
  if (!isMatch) {
    return res.status(400).json({ error: "Invalid username or password." });
  }
  // Generate JWT token
  const token = await jwtSign({ userEmail });

  // res.status(200).json({ message: "Login successful.", token });
  sendResponse(res, { token }, appConstant.SUCCESSLOGIN);
});

exports.getAllUser = catchAsync(async (req, res) => {
  const users = await getAllUsers();
  sendResponse(res, { users }, appConstant.GETALLUSER);
});
