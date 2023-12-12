"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const payment_controller_1 = require("../controllers/payment.controller");
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const PaymentRouter = (0, express_1.Router)();
PaymentRouter.post("/bill", auth_middleware_1.default, payment_controller_1.bill);
PaymentRouter.post("/electricity", auth_middleware_1.default, payment_controller_1.electricity);
PaymentRouter.post("/mobile-airtime", auth_middleware_1.default, payment_controller_1.mobileAirtime);
PaymentRouter.post("/mobile-data", auth_middleware_1.default, payment_controller_1.mobileData);
PaymentRouter.post("/approve", auth_middleware_1.default, payment_controller_1.approve);
exports.default = PaymentRouter;
