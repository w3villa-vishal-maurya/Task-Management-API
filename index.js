const express = require("express");
const connectionConfig = require("./db/connection");
const User = require("./model/User");
const bodyParser = require("body-parser");
const public_routes = require("./route/public_route");
const auth_routes = require("./route/auth_route");
const badReq = require("./middleware/badRoute");
const session = require("express-session");
const {verifyJWT} = require("./middleware/validation");

const PORT = 3000;
const app = express();

connectionConfig();


app.use(express.json());
app.use(bodyParser.json());
app.use("/user", session({secret: "secret", resave: true, saveUninitialized: true}));

app.use("/user/auth/*", verifyJWT);

app.get("/", (req, res)=>{
    return res.status(200).json({title:"Success", message: "Hello from the server side!!!"});
})


app.use("/", public_routes);
app.use("/user", auth_routes);


app.use("/*", badReq);

app.listen(PORT, ()=>{
    console.log("You are listening the port: ", PORT);
})