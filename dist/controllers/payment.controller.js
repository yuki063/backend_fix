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
exports.stripePayment = exports.approve = exports.mobileData = exports.mobileAirtime = exports.bill = exports.electricity = void 0;
const apis_1 = require("../apis");
const uuid_1 = require("uuid");
const api_response_1 = require("../util/api.response");
const stripe_1 = __importDefault(require("stripe"));
const electricity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.user);
    const { amount, linkedWalletOrCardId, meterNumber, paymentType, transactionType, track2Data } = req.body;
    if (!amount ||
        !linkedWalletOrCardId ||
        !meterNumber ||
        !paymentType ||
        !transactionType) {
        const missing = [
            "amount",
            "linkedWalletOrCardId",
            "meterNumber",
            "paymentType",
            "transactionType"
        ].filter((item) => !req.body[item]);
        return (0, api_response_1.errorResponse)("Invalid request", res, {
            reason: `Missing: ${missing.join(", ")}`
        });
    }
    res.status(200).json({ message: "electricity request success" });
});
exports.electricity = electricity;
const bill = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { amount, accountNumber, linkedWalletOrCardId } = req.body;
    if (!amount || !accountNumber || !linkedWalletOrCardId) {
        const missing = ["amount", "accountNumber", "linkedWalletOrCardId"].filter((item) => !req.body[item]);
        return (0, api_response_1.errorResponse)("Invalid request", res, {
            reason: `Missing: ${missing.join(", ")}`
        });
    }
    res.status(200).json({ message: "bill request success" });
});
exports.bill = bill;
const mobileAirtime = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const requestId = (0, uuid_1.v4)();
        const { amount, mobileNumber, vendMetaData, vendorId } = req.body;
        if (!amount || !vendMetaData || !vendorId || !mobileNumber) {
            const missing = [
                "amount",
                "vendMetaData",
                "vendorId",
                "mobileNumber"
            ].filter((item) => !req.body[item]);
            return (0, api_response_1.errorResponse)("Invalid request", res, {
                reason: `Missing: ${missing.join(", ")}`
            });
        }
        const REQUEST_DATA = Object.assign(Object.assign({}, req.body), { requestId });
        const request = yield apis_1.PAYMENT_API.post("/mobile/airtime/sales", Object.assign({}, REQUEST_DATA));
        const response = yield request.data;
        console.log(response);
        res.status(200).json({ message: "mobile airtime request success" });
    }
    catch (error) {
        console.log(error);
        (0, api_response_1.serverErrorResponse)(error, res);
    }
});
exports.mobileAirtime = mobileAirtime;
const mobileData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const requestId = (0, uuid_1.v4)();
        const { productId, mobileNumber, vendMetaData, vendorId } = req.body;
        if (!productId || !vendMetaData || !vendorId || !mobileNumber) {
            const missing = [
                "productId",
                "vendMetaData",
                "vendorId",
                "mobileNumber"
            ].filter((item) => !req.body[item]);
            return (0, api_response_1.errorResponse)("Invalid request", res, {
                reason: `Missing: ${missing.join(", ")}`
            });
        }
        const REQUEST_DATA = Object.assign(Object.assign({}, req.body), { requestId });
        const request = yield apis_1.PAYMENT_API.post("/mobile/bundle/sales", Object.assign({}, REQUEST_DATA));
        const response = yield request.data;
        console.log(response);
        res.status(200).json({ message: "mobile data request success" });
    }
    catch (error) {
        console.log(error);
        (0, api_response_1.serverErrorResponse)(error, res);
    }
});
exports.mobileData = mobileData;
const approve = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).json({ message: "electricity request success" });
});
exports.approve = approve;
const StripeFun = (email, name, amount, stripe_key) => __awaiter(void 0, void 0, void 0, function* () {
    const stripe = new stripe_1.default(stripe_key);
    const session = yield stripe.checkout.sessions.create({
        line_items: [
            {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: name,
                    },
                    unit_amount: parseFloat(amount) * 100,
                },
                quantity: 1,
            },
        ],
        customer_email: email,
        mode: 'payment',
        success_url: process.env.FRONTEND_URL + '/stripe?confirm=true',
        cancel_url: process.env.FRONTEND_URL + '/stripe?confirm=false',
    });
    return session.url;
});
const stripePayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const stripe_key = 'sk_test_51OKw5bDgDmJR6QyjWYUU93fed7tAExK7eFgyjjEqv6PBDf3CThAS8hY45SbKCWXN0B03SbcjSqvFbRma7SCKGb2l00nHtA9oZU';
    const { amount } = req.body;
    console.log(amount);
    const session_url = yield StripeFun('test@gmail.com', 'Tester', amount, stripe_key);
    console.log(amount);
    res.status(200).json({ url: session_url });
});
exports.stripePayment = stripePayment;
