const {
  catchAsync,
  sendResponse,
  sendMessageResponse,
} = require("../../helper/common");
const { appConstant } = require("../../Config/constant/appConstant");
const redisClient = require("../../helper/redis");

// Helper function to get all users from Redis
const getAllUsers = async () => {
  try {
    const result = await redisClient.sendCommand(["HKEYS", "users"]);
    return result;
  } catch (err) {
    throw err;
  }
};

const generateRow = (id) => {
  const row = { id }; // Include an ID for each row
  for (let i = 1; i <= 150; i++) {
    row[`column_${i}`] = `column_${i}`; // Generate random data
  }
  return row;
};

const setAllDummy = async () => {
  const numRows = 20000;

  for (let i = 1; i <= numRows; i++) {
    const row = generateRow(i);
    // await client.set(`row:${i}`, JSON.stringify(row)); // Store each row as a JSON string
    key = `row:${i}`;
    await redisClient.sendCommand([
      "JSON.SET",
      key,
      "$",
      JSON.stringify(row), // Store as JSON string
    ]);
    if (i % 1000 === 0) {
      console.log(`Stored ${i}/${numRows} rows in Redis.`);
    }
  }
};

exports.getAllUser = catchAsync(async (req, res) => {
  const users = await getAllUsers();
  console.log(users, "getAllUsers");
  if (!users) {
    return sendMessageResponse(res, appConstant.NOUSERFOUND);
  } else {
    sendResponse(res, { noOfUsers: users.length }, appConstant.GETALLUSER);
  }
});

exports.getTableData = catchAsync(async (req, res) => {
  console.log("getTableData");
  const pageNo = parseInt(req.query.pageNo, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const start = (pageNo - 1) * limit;
  const end = start + limit - 1;

  const keys = [];
  for (let i = start; i <= end; i++) {
    keys.push(`row:${i}`);
  }
  let data = await Promise.all(
    keys.map(async (key) => {
      const value = await redisClient.sendCommand(["JSON.GET", key, "$"]);
      if (value) {
        let arr = JSON.parse(value);
        // console.log(JSON.parse(value), "value");
        return arr[0];
        // return value ? JSON.parse(value[0]) : null;
      }
    })
  );
  let newdata = data.filter((item) => item != null);

  sendResponse(res, { data: newdata }, appConstant.GETALLUSER);
});

exports.generateDummyData = catchAsync(async (req, res) => {
  await setAllDummy();
  sendMessageResponse(res, appConstant.SUCCESSREGISTER);
});
