const auth_routes = require("express").Router();
const { loginReq, logOutReq } = require("../controller/controllerConfig");
const { loginValidator } = require("../middleware/validation");

auth_routes.post("/login",
    loginValidator,
    loginReq
);

auth_routes.get("/auth/profile", (req, res) => {
    // console.log(req.user);
    return res.status(200).send(req.user);
})


auth_routes.get("/auth/logout", logOutReq)

module.exports = auth_routes;