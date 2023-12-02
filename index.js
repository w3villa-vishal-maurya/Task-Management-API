const express = require("express");

// Database connection and model path
const connectionConfig = require("./db/connection");
const User = require("./model/User");

// express custom module
const bodyParser = require("body-parser");
const session = require("express-session");

// Routers 
const public_routes = require("./route/public_routes");
const auth_routes = require("./route/auth_routes");
const badReq = require("./route/badRoute");

// Middlewere
const { verifyJWT } = require("./middleware/validation");



// Logger NPM module
const logger = require("./logger/logger");

// Swagger NPM module
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger/swagger-output.json')



// Add the global unhandled rejection handler
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    // Additional logging or error handling can be added here
});

const PORT = 3000;
const app = express();

connectionConfig();

//  Use of all middleweres
app.use(express.json());
app.use(bodyParser.json());
app.use("/user", session({ secret: "secret", resave: true, saveUninitialized: true }));
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))
app.use("/user/auth/*", verifyJWT);
app.set('trust proxy', 1);

// Use of all Routes
app.use("/", public_routes);
app.use("/user", auth_routes);
app.use("/*", badReq);

// Connectiong to the server
app.listen(PORT, () => {
    // console.log("You are listening the port: ", PORT);
    logger.info(`Server is started running, You are listening the port: ${PORT}`);
    logger.info(`Server is running!\nAPI documentation: http://localhost:3000/doc`)
})

module.exports = app;
