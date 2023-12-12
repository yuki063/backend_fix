"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_response_1 = require("../util/api.response");
function default_1(req, res, next) {
    if (!req.user) {
        return (0, api_response_1.errorResponse)("Access Denied! You need to login first", res);
    }
    try {
        if (req.user.step < 5) {
            return (0, api_response_1.errorResponse)("You have already completed the step", res, req.user.step);
        }
        next();
    }
    catch (ex) {
        return (0, api_response_1.errorResponse)("Invalid token", res);
    }
}
exports.default = default_1;
