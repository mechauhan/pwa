// const redis = require("redis");
// const client = redis.createClient({
//   port: 6379,
//   host: "localhost",
// });

// (async () => {
//   await client.connect();

//   for (let i = 1; i <= 20000; i++) {
//     const rowData = {};
//     for (let j = 1; j <= 150; j++) {
//       rowData[`col${j}`] = `value${j}_${i}`;
//     }
//     await client.hSet(`row:${i}`, rowData); // Store each row as a Redis hash
//   }

//   console.log("Data inserted into Redis.");
//   await client.quit();
// })();
