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
Object.defineProperty(exports, "__esModule", { value: true });
exports.approve = exports.mobileData = exports.mobileAirtime = exports.bill = exports.electricity = void 0;
const apis_1 = require("../apis");
const uuid_1 = require("uuid");
const api_response_1 = require("../util/api.response");
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
