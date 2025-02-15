const redis = require("redis");

const client = redis.createClient({
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
});

client.on("error", (err) => console.error("Redis Client Error", err));

(async () => {
  try {
    await client.connect();
    console.log("Connected to Redis!");

    const bicycles = [
      {
        id: 1,
        brand: "Trek",
        model: "Domane SL6",
        price: 3500,
      },
      {
        id: 2,
        brand: "Specialized",
        model: "Tarmac SL7",
        price: 5000,
      },
    ];
  } catch (error) {
    console.error("Error connecting to Redis:", error);
  } finally {
    // await client.disconnect();
  }
})();

module.exports = client;
