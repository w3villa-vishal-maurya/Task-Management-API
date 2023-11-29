const redis = require("redis");

const REDIS_PORT = 6397;

const client = redis.createClient()
 
client.connect();

client.on("connect", (err)=>{
  if(err){
    console.log({error : err.message});
  }

  console.log("Connected to the server");
})

module.exports = client;
