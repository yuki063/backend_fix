"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buyElectricity = exports.confirmElectricityMeterNumber = exports.walletToWallet = void 0;
const api_response_1 = require("../util/api.response");
const stripe_config_1 = __importDefault(require("../config/stripe.config"));
const wallet_model_1 = __importDefault(require("../models/wallet.model"));
const walletToWallet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { amount, sourceCustomerId, destinationCustomerId } = req.body;
        const charge = yield stripe_config_1.default.charges.create({
            amount: amount,
            currency: "sar",
            customer: sourceCustomerId,
        });
        yield wallet_model_1.default.findOneAndUpdate({
            walletId: sourceCustomerId,
        }, {
            $inc: { balance: -amount },
        });
        // Transfer the amount from the source customer to the destination customer
        yield stripe_config_1.default.transfers.create({
            amount: amount,
            currency: "usd",
            destination: destinationCustomerId,
        });
        yield wallet_model_1.default.findOneAndUpdate({
            walletId: destinationCustomerId,
        }, {
            $inc: { balance: amount },
        });
        return (0, api_response_1.successResponse)("you have transfered your money to another wallet successfully", null, res);
    }
    catch (error) {
        return (0, api_response_1.serverErrorResponse)(error, res);
    }
});
exports.walletToWallet = walletToWallet;
const confirmElectricityMeterNumber = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const { meterNumber } = req.body;
        // const 
    }
    catch (error) {
        return (0, api_response_1.serverErrorResponse)(error, res);
    }
});
exports.confirmElectricityMeterNumber = confirmElectricityMeterNumber;
const buyElectricity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const { meterNumber, amount } = req.body;
    }
    catch (error) {
        return (0, api_response_1.serverErrorResponse)(error, res);
    }
});
exports.buyElectricity = buyElectricity;
