"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serverErrorResponse = exports.notFoundResponse = exports.errorResponse = exports.successResponse = void 0;
const successResponse = (message, body, res) => {
    return res.status(200).json({
        status: 200,
        message: message,
        data: body,
    });
};
exports.successResponse = successResponse;
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
const notFoundResponse = (field, value, entity, res) => {
    return res.status(404).json({
        status: 404,
        message: entity + " with " + field + " of [" + value + "] not found",
    });
};
exports.notFoundResponse = notFoundResponse;
const serverErrorResponse = (ex, res) => {
    return res.status(500).json({
        status: 500,
        message: "Server Error",
        stackTrace: ex,
    });
};
exports.serverErrorResponse = serverErrorResponse;
