const mongoose = require("mongoose");
const env = require("dotenv").config();

module.exports =  function connectionConfig(){
    mongoose.connect(process.env.CONNECT_URL)
    .then((e)=>{
        console.log(`Connect to mongoDb: ${e.connection.host}`);
    })
    .catch((err)=>{
        console.log(err);
    })
}

