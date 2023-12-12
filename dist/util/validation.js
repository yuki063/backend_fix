"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bankCardSchema = exports.walletSchema = exports.cardHolderSchema = exports.newPasswordSchema = exports.bankCardTopUpSchema = exports.virtualSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const newPasswordSchema = joi_1.default.object().keys({
    password: joi_1.default.string().required(),
});
exports.newPasswordSchema = newPasswordSchema;
exports.virtualSchema = joi_1.default.object().keys({
    cardholderName: joi_1.default.string().required(),
    cardNumber: joi_1.default.string().required(),
    cardExpiry: joi_1.default.object()
        .keys({
        month: joi_1.default.number().required(),
        year: joi_1.default.number().required(),
    })
        .required(),
    billingAddress: joi_1.default.object()
        .keys({
        country: joi_1.default.string().required(),
        city: joi_1.default.string().required(),
        street: joi_1.default.string().required(),
        houseNumber: joi_1.default.string().required(),
        line1: joi_1.default.string().required(),
        line2: joi_1.default.string().required(),
    })
        .required(),
    cardholderPhoneNumber: joi_1.default.string().required(),
    cardholderEmail: joi_1.default.string().email().required(),
});
const walletSchema = joi_1.default.object().keys({
    name: joi_1.default.string().required(),
    kind: joi_1.default.string().required(),
});
exports.walletSchema = walletSchema;
const bankCardSchema = joi_1.default.object().keys({
    cardNumber: joi_1.default.number().required(),
    nameOnCard: joi_1.default.string().required(),
    thru: joi_1.default.string().required(),
    cvv: joi_1.default.number().required(),
    nickName: joi_1.default.string().required(),
});
exports.bankCardSchema = bankCardSchema;
const cardHolderSchema = joi_1.default.object().keys({
    name: joi_1.default.string().required(),
    email: joi_1.default.string().email().required(),
    phone_number: joi_1.default.string().required(),
    address: joi_1.default.object().keys({
        line1: joi_1.default.string().required(),
        city: joi_1.default.string().required(),
        state: joi_1.default.string().required(),
        postal_code: joi_1.default.string().required(),
        country: joi_1.default.string().required(),
    }),
});
exports.cardHolderSchema = cardHolderSchema;
const bankCardTopUpSchema = joi_1.default.object().keys({
    sourceId: joi_1.default.string().required(),
    walletId: joi_1.default.string().required(),
    amount: joi_1.default.number().required(),
});
exports.bankCardTopUpSchema = bankCardTopUpSchema;
