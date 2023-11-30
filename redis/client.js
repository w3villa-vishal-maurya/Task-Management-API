const redis = require("redis");
const logger = require("../logger/logger");

const REDIS_PORT = 6397;

const client = redis.createClient()
 
client.connect();

client.on("connect", (err)=>{
  if(err){
    logger.error(err.message);
    // console.log({error : err.message});
  }

  logger.info("Connected to the redis server");
  // console.log("Connected to the server");
})

module.exports = client;
