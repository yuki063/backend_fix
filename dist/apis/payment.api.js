"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PAYMENT_API = void 0;
const axios_1 = __importDefault(require("axios"));
exports.PAYMENT_API = axios_1.default.create({
    baseURL: process.env.PAYMENT_API_URL,
    headers: {
        Accept: "application/json",
        apikey: process.env.PAYMENT_API_KEY,
        Authorization: `Basic ${process.env.PAYMENT_AUTHORIZATION}`
    }
});
