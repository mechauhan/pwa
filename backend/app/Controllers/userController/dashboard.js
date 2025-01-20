const {
  catchAsync,
  sendResponse,
  sendMessageResponse,
} = require("../../helper/common");
const { appConstant } = require("../../Config/constant/appConstant");
const redisClient = require("../../helper/redis");

// Helper function to get all users from Redis
const getAllUsers = async () => {
  return new Promise((resolve, reject) => {
    redisClient.hkeys("users", (err, keys) => {
      if (err) return reject(err);
      resolve(keys);
    });
  });
};

exports.getAllUser = catchAsync(async (req, res) => {
  console.log("asdasdasd");

  const users = await getAllUsers();
  if (!users) {
    return sendMessageResponse(res, appConstant.NOUSERFOUND);
  } else {
    sendResponse(res, { noOfUsers: users.length }, appConstant.GETALLUSER);
  }
});

exports.getTableData = catchAsync(async (req, res) => {
  const { pageNo, limit } = req.query;
  const start = (pageNo - 1) * limit;
  const end = start + limit - 1;
  const keys = await getAllUsers();
  const data = [];
  for (let i = start; i <= end; i++) {
    const key = keys[i];
    const value = await redisClient.hget("users", key);
    data.push({ key, value });
  }
  sendResponse(res, { data }, appConstant.GETALLUSER);
});
