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
const api_response_1 = require("../util/api.response");
const stripe_config_1 = __importDefault(require("../config/stripe.config"));
const transaction_model_1 = __importDefault(require("../models/transaction.model"));
const withdraw = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { sourceId, currency, amount } = req.body;
        yield stripe_config_1.default.payouts.create({
            amount,
            currency,
            destination: sourceId,
        });
        return (0, api_response_1.successResponse)("You have withdrawn money from your wallet to your card number", null, res);
    }
    catch (error) {
        return (0, api_response_1.serverErrorResponse)(error, res);
    }
});
const cancelCard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield stripe_config_1.default.issuing.cards.update("card_id", {
            status: "canceled",
            cancellation_reason: "lost, stolen",
        });
    }
    catch (error) {
        return (0, api_response_1.serverErrorResponse)(error, res);
    }
});
const transferWalletToWallet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { sourceCustomerId, destinationCustomerId, amount } = req.body;
        // Create a charge on the source customer
        const charge = yield stripe_config_1.default.charges.create({
            amount: amount,
            currency: "usd",
            customer: sourceCustomerId,
        });
        // Transfer the amount from the source customer to the destination customer
        yield stripe_config_1.default.transfers.create({
            amount: amount,
            currency: "usd",
            destination: destinationCustomerId,
        });
        console.log("Transfer completed successfully");
    }
    catch (error) {
        return (0, api_response_1.serverErrorResponse)(error, res);
    }
});
const getTransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const transactions = yield transaction_model_1.default.aggregate([
        {
            $match: {
                user: req.user._id,
                wallet: "wallet id"
            },
            $group: {
                _id: "$date",
            }
        },
    ]);
});
