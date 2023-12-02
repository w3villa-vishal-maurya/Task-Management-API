const redis = require("redis");
const logger = require("../logger/logger");

const REDIS_PORT = process.env.REDIS_PORT || 6379;
const REDIS_HOST = process.env.REDIS_HOST;

const client = redis.createClient({
  host: REDIS_HOST,
  port: REDIS_PORT,
  // Add other configuration options as needed
})

client.connect();

client.on("connect", (err) => {
  if (err) {
    logger.error(err.message);
    console.log({error : err.message});
  }

  logger.info("Connected to the redis server");
  console.log("Connected to the server");
})

module.exports = client;
