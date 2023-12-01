const public_routes = require("express").Router();
const { regReq, forgetPassword, resetPassword} = require("../controller/userController");
const { regValidator } = require("../middleware/validation");


public_routes.get("/", (req, res) => {
    return res.status(200).json({ title: "Success", message: "welcome to the Task Management API!!!" });
})


public_routes.post("/register",
    regValidator,
    regReq);


public_routes.post("/forget-password", forgetPassword);

public_routes.post("/reset-password/:token", resetPassword);

module.exports = public_routes;