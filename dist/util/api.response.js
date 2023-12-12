"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serverErrorResponse = exports.errorResponse = exports.unAuthorizaedResponse = exports.successResponse = void 0;
const successResponse = (message, body, res) => {
    return res.status(200).json({
        status: 200,
        message: message,
        data: body,
    });
};
exports.successResponse = successResponse;
const unAuthorizaedResponse = (message, res) => {
    return res.status(401).json({
        status: 401,
        message: message,
    });
};
exports.unAuthorizaedResponse = unAuthorizaedResponse;
const errorResponse = (message, res, data) => {
    if (data) {
        return res.status(400).json({
            status: 400,
            message: message,
            data,
        });
    }
    return res.status(400).json({
        status: 400,
        message: message,
    });
};
exports.errorResponse = errorResponse;
const serverErrorResponse = (ex, res) => {
    return res.status(500).json({
        status: 500,
        message: "Server Error",
        stackTrace: ex,
    });
};
exports.serverErrorResponse = serverErrorResponse;
