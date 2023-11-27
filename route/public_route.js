const public_routes = require("express").Router();
const {regReq} = require("../controller/controllerConfig");
const {regValidator} = require("../middleware/validation");

public_routes.post("/register",
regValidator,
 regReq);

module.exports = public_routes;