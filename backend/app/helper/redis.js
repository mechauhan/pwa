const redis = require("redis");

const client = redis.createClient({
  username: "default",
  password: "7YvRB7aDLlZVbA0QJCvPglT0GdOJEjPE",
  socket: {
    host: "redis-14491.c305.ap-south-1-1.ec2.redns.redis-cloud.com",
    port: 14491,
  },
});

client.on("connect", async () => {
  console.log("client connected to redis");
  let isInitialized = await client.get("data_initialized");
  console.log(isInitialized);

  if (isInitialized) {
    return;
  }
  // adding dummy data
  // for (let i = 1; i <= 20000; i++) {
  //   const rowData = {};
  //   for (let j = 1; j <= 150; j++) {
  //     rowData[`col${j}`] = `value${j}_${i}`;
  //   }
  //   client.hset(`row:${i}`, rowData, (err) => {
  //     if (err) {
  //       console.log(err);
  //     }
  //   });
  // }
  try {
    // client.hset("data_initialized", { status: true }, (err) => {
    //   if (err) {
    //     console.log(err);
    //   }
    // });
    await client.set("bike:1", "Process 134");
    const value = await client.get("bike:1");
    console.log(value);
  } catch (error) {
    console.log(error);
  }
});
client.on("ready", () =>
  console.log("client connected to redis and ready to use")
);
client.on("end", () => console.log("client disconnected from redis"));
client.on("error", (err) => console.log(err));

process.on("SIGINT", () => client.quit());

module.exports = client;
