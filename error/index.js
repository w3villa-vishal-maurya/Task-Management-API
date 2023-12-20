const AnonymousError = require("./anonymous");
const BadRequestError = require("./bad-request");
const CustomAPIError = require("./custom-api");
const NotFoundError = require("./not-found");
const UnauthenticatedError = require("./unauthenticated");

module.exports = {
    AnonymousError,
    BadRequestError,
    CustomAPIError,
    NotFoundError,
    UnauthenticatedError
}