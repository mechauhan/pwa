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

// Function to get user data along with login time
const getUserData = async (userId) => {
  try {
    const userKey = `user:${userId}`;
    const userData = await redisClient.sendCommand(["HGETALL", userKey]);
    console.log("userData", userData);

    if (userData.length === 0) {
      console.log("User not found.");
      return null;
    }
    const userObject = {
      email: userData[1],
      password: userData[3],
      loginTime: userData[5],
    };

    console.log("User data retrieved:", userObject);
    return userObject;
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
};

// Helper function to save user in Redis
const saveUser = async (username, hashedPassword) => {
  try {
    const loginTime = new Date().toISOString();
    let key = `user:${username}`;
    const result = await redisClient.sendCommand([
      "HSET",
      key,
      "email",
      username,
      "password",
      hashedPassword,
      "loginTime",
      loginTime,
      "currentState",
      JSON.stringify({ pageNo: 0, limit: 10 }),
    ]);
    return result;
  } catch (err) {
    throw err;
  }
};

// Function to update user login time
const updateLoginTime = async (userId) => {
  try {
    const userKey = `user:${userId}`;
    const loginTime = new Date().toISOString();
    await redisClient.sendCommand(["HSET", userKey, "loginTime", loginTime]);

    console.log(`Login time for user ${userId} updated successfully.`);
  } catch (error) {
    console.error("Error updating login time:", error);
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

  let existingUser = await getUserData(userEmail);
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
  const savedUser = await getUserData(userEmail);
  if (!savedUser.password) {
    return res.status(400).json({ error: "Invalid username or password." });
  }

  // Compare passwords
  const isMatch = await bcrypt.compare(password, savedUser.password);
  if (!isMatch) {
    return res.status(400).json({ error: "Invalid username or password." });
  }
  // Generate JWT token
  await updateLoginTime(userEmail);
  const token = await jwtSign({ userEmail });

  // res.status(200).json({ message: "Login successful.", token });
  sendResponse(res, { token }, appConstant.SUCCESSLOGIN);
});

exports.getAllUser = catchAsync(async (req, res) => {
  const users = await getAllUsers();
  sendResponse(res, { users }, appConstant.GETALLUSER);
});
