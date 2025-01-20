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
  console.log("getTableData");
  // const { pageNo, limit } = req.query;
  // const start = (pageNo - 1) * limit;
  // const end = start + limit - 1;
  // const keys = await getAllUsers();
  const data = [];
  // for (let i = 1; i <= 100; i++) {
  //   const rowData = {};
  //   let data = await redisClient.hget(`row:${i}`, (err, reply) => {
  //     if (err) {
  //       console.log(err);
  //     }
  //     data.push(reply);
  //   });
  // client.hset(`row:${i}`, rowData, (err) => {
  //   if (err) {
  //     console.log(err);
  //   }
  // });
  // }
  sendResponse(res, { data }, appConstant.GETALLUSER);
});
