"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const api_response_1 = require("../util/api.response");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const { verify } = jsonwebtoken_1.default;
function default_1(req, res, next) {
    var _a, _b;
    if (!req.header("Authorization"))
        return (0, api_response_1.errorResponse)("Access Denied! You need to login first", res);
    const token = (_b = (_a = req
        .header("Authorization")) === null || _a === void 0 ? void 0 : _a.trim()) === null || _b === void 0 ? void 0 : _b.replace("Bearer ", "");
    if (!token)
        return (0, api_response_1.errorResponse)("Access Denied! You need to login first", res);
    try {
        let key = process.env.JWT_KEY ? process.env.JWT_KEY.trim() : "";
        const decoded = verify(token, key);
        req.user = Object.assign({}, decoded);
        next();
    }
    catch (ex) {
        return (0, api_response_1.errorResponse)("Invalid token", res);
    }
}
exports.default = default_1;
