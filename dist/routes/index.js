"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const card_router_1 = __importDefault(require("./card.router"));
const payment_router_1 = __importDefault(require("./payment.router"));
const user_router_1 = __importDefault(require("./user.router"));
const wallet_router_1 = __importDefault(require("./wallet.router"));
const api = (0, express_1.Router)();
api.use("/users", user_router_1.default);
api.use("/cards", card_router_1.default);
api.use("/wallets", wallet_router_1.default);
api.use("/payment", payment_router_1.default);
exports.default = api;
