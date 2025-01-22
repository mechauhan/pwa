const {
  catchAsync,
  sendResponse,
  sendMessageResponse,
} = require("../../helper/common");
const { appConstant } = require("../../Config/constant/appConstant");
const redisClient = require("../../helper/redis");
const e = require("cors");

// Helper function to get all users from Redis
const getAllUsers = async () => {
  try {
    const keys = await redisClient.sendCommand(["KEYS", "user:*"]);
    const totalCount = keys.length;

    console.log(`Total users: ${totalCount}`);
    return totalCount;
  } catch (error) {
    console.log(error);
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

const countJSONKeys = async () => {
  try {
    const keys = await redisClient.sendCommand(["KEYS", "row:*"]);
    const totalCount = keys.length;

    console.log(`Total table data: ${totalCount}`);
    return totalCount;
  } catch (error) {
    console.error("Error counting JSON keys:", error);
    throw error;
  }
};

exports.getAllUser = catchAsync(async (req, res) => {
  const users = await getAllUsers();
  console.log(users, "getAllUsers");
  if (!users) {
    return sendMessageResponse(res, appConstant.NOUSERFOUND);
  } else {
    sendResponse(res, { noOfUsers: users }, appConstant.GETALLUSER);
  }
});

exports.getTableData = catchAsync(async (req, res) => {
  console.log("getTableData");

  const email = req.user.userEmail;

  const refresh = req.query.refresh === "true"; // Check if the request indicates a page refresh

  let pageNo, limit;

  if (refresh) {
    // Fetch the last accessed page and limit from Redis
    const lastPageData = await redisClient.sendCommand([
      "HGET",
      `user:${email}`,
      "currentState",
    ]);

    if (lastPageData) {
      const parsedData = JSON.parse(lastPageData);
      pageNo = parsedData.pageNo;
      limit = parsedData.limit;
    } else {
      // Default values if no previous data found
      pageNo = 1;
      limit = 10;
    }
  } else {
    // Use provided query params
    pageNo = parseInt(req.query.pageNo, 10) || 1;
    limit = parseInt(req.query.limit, 10) || 10;

    // Save the current page and limit in Redis
    await redisClient.sendCommand([
      "HSET",
      `user:${email}`,
      "currentState",
      JSON.stringify({ pageNo, limit }),
    ]);
  }

  // Pagination logic
  const start = (pageNo - 1) * limit;
  const end = start + limit - 1;

  const keys = [];
  const count = await countJSONKeys();
  console.log(count, "count");

  for (let i = start; i <= end; i++) {
    keys.push(`row:${i}`);
  }

  let data = await Promise.all(
    keys.map(async (key) => {
      const value = await redisClient.sendCommand(["JSON.GET", key, "$"]);
      if (value) {
        let arr = JSON.parse(value);
        return arr[0];
      }
    })
  );

  let newdata = data.filter((item) => item != null);

  sendResponse(
    res,
    { data: newdata, total: count, pageNo, limit },
    appConstant.GETALLUSER
  );
});

exports.generateDummyData = catchAsync(async (req, res) => {
  await setAllDummy();
  sendMessageResponse(res, appConstant.SUCCESSREGISTER);
});
