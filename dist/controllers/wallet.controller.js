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
exports.topUpWallet = exports.getYourWallets = exports.createWallet = exports.getWallet = void 0;
const api_response_1 = require("../util/api.response");
const validation_1 = require("../util/validation");
const wallet_model_1 = __importDefault(require("../models/wallet.model"));
const getWallet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.query;
        const wallet = yield wallet_model_1.default.findOne({
            _id: id,
            user: req.user._id,
            status: "ACTIVATED",
        }, {
            balance: 1,
            availableBalance: 1,
            name: 1,
        });
        return (0, api_response_1.successResponse)("Wallet retrieved successfully", wallet, res);
    }
    catch (error) {
        return (0, api_response_1.serverErrorResponse)(error, res);
    }
});
exports.getWallet = getWallet;
const createWallet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("ggggg");
        const { email, phoneNumber, currency = "sar", name, kind } = req.body;
        if (!email && !phoneNumber) {
            return (0, api_response_1.errorResponse)("Enter your phone number or email", res);
        }
        const { error } = validation_1.walletSchema.validate({ kind, name });
        if (error) {
            return (0, api_response_1.errorResponse)(error.details[0].message, res);
        }
        if (kind !== "WALLET_ONLY" && kind !== "VIRTUAL_CARD") {
            return (0, api_response_1.errorResponse)("Invalid wallet kind", res);
        }
        const wallet = new wallet_model_1.default({
            currency,
            user: req.user._id,
            kind,
            name,
        });
        console.log(wallet);
        yield wallet.save();
        return (0, api_response_1.successResponse)("Wallet created successfully", null, res);
    }
    catch (error) {
        console.log(error);
        return (0, api_response_1.serverErrorResponse)(error, res);
    }
});
exports.createWallet = createWallet;
const getYourWallets = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const wallets = yield wallet_model_1.default.find({
            user: req.user._id,
            status: "ACTIVATED",
        }, {
            name: 1,
            balance: 1,
            availableBalance: 1,
        });
        return (0, api_response_1.successResponse)("Wallets retrieved successfully", wallets, res);
    }
    catch (error) {
        return (0, api_response_1.serverErrorResponse)(error, res);
    }
});
exports.getYourWallets = getYourWallets;
const topUpWallet = (req, res) => __awaiter(void 0, void 0, void 0, function* () { });
exports.topUpWallet = topUpWallet;
