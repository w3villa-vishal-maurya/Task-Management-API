const public_routes = require("express").Router();
const { regReq, loginReq, logOutReq, forgetPassword, resetPassword } = require("../controller/userController");
const { regValidator, loginValidator } = require("../middleware/validation");



// Autherization Middleware
const { verifyJWT } = require("../middleware/validation");


public_routes.get("/", (req, res) => {
    return res.status(200).json({ title: "Success", message: "welcome to the Task Management API!!!" });
})


public_routes.post("/register",
    regValidator,
    regReq);


public_routes.post("/forget-password",
    forgetPassword);

public_routes.post("/reset-password/:token",
    resetPassword);

public_routes.post("/login",
    loginValidator,
    loginReq
);

//  All the below must be verified by token 
public_routes.use(verifyJWT);


// ##### User Credentials Routes #############
public_routes.get("/profile",
    (req, res) => {
        return res.status(200).send(req.session.autherization["user"]);
    })


public_routes.get("/logout",
    logOutReq);


module.exports = public_routes;