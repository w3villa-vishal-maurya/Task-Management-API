const public_routes = require("express").Router();
const { regReq, forgetPassword } = require("../controller/userController");
const { regValidator } = require("../middleware/validation");


public_routes.post("/register",
    regValidator,
    regReq);


public_routes.post("/forget-password", forgetPassword);

module.exports = public_routes;