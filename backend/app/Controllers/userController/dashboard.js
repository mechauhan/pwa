const {
  catchAsync,
  sendResponse,
  sendMessageResponse,
} = require("../../helper/common");
const { appConstant } = require("../../Config/constant/appConstant");
const redisClient = require("../../helper/redis");

// Helper function to get all users from Redis
const getAllUsers = async () => {
  let cursor = "0";
  let totalCount = 0;
  try {
    do {
      const response = await redisClient.sendCommand([
        "SCAN",
        cursor,
        "MATCH",
        "user:*",
      ]);
      cursor = response[0];
      const keys = response[1];

      totalCount += keys.length;
    } while (cursor !== "0");

    console.log(`Total users: ${totalCount}`);
    return totalCount;
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

const countJSONKeys = async () => {
  try {
    let cursor = "0"; // Start with the initial cursor value of "0"
    let totalCount = 0; // Variable to store the total number of keys

    // Loop to iterate over all matching keys using SCAN
    do {
      // SCAN to fetch the next batch of keys
      const [newCursor, keys] = await redisClient.sendCommand([
        "SCAN",
        cursor, // Starting cursor (0 in the first iteration)
        "MATCH",
        "row:*", // Pattern to match keys (e.g., row:1, row:2, ...)
        "COUNT",
        "1000", // Fetch in batches of 1000
      ]);

      // Increment the total count by the number of keys returned in this batch
      totalCount += keys.length;
      cursor = newCursor; // Update the cursor for the next iteration

      // Optionally, log progress every 1000 keys
      console.log(`Processed ${totalCount} keys...`);
    } while (cursor !== "0"); // Stop when cursor is "0", indicating the end

    console.log(`Total JSON keys stored: ${totalCount}`);
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
  const pageNo = parseInt(req.query.pageNo, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const start = pageNo * limit;
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
        // console.log(JSON.parse(value), "value");
        return arr[0];
        // return value ? JSON.parse(value[0]) : null;
      }
    })
  );
  let newdata = data.filter((item) => item != null);

  sendResponse(res, { data: newdata, total: count }, appConstant.GETALLUSER);
});

exports.generateDummyData = catchAsync(async (req, res) => {
  await setAllDummy();
  sendMessageResponse(res, appConstant.SUCCESSREGISTER);
});
