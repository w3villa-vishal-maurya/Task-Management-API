const CustomAPIError = require("./custom-api");
const { StatusCodes } = require("http-status-codes");


class AnonymousError extends CustomAPIError {
    constructor(message, statusCodes){
        super(message);
        this.statusCode = statusCode || StatusCodes.UNAUTHORIZED;
    }
}

module.exports = AnonymousError;