const CustomAPIError = require("./custom-api");
const { StatusCodes } = require("http-status-codes");

class NotFoundError extends CustomAPIError{
    constructor(message, statusCode){
        super(message);

        this.statusCode = statusCode || StatusCodes.NOT_FOUND;
    }
}

module.exports = NotFoundError;