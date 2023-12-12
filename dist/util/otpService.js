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
exports.verifyOTP = exports.createNewOTP = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const KEY = process.env.JWT_KEY;
function createNewOTP(phone) {
    let otp = Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, "0");
    // let otp = "1122";
    const hash = (0, jsonwebtoken_1.sign)({ phone, otp }, KEY, { expiresIn: "5m" });
    return { hash, otp };
}
exports.createNewOTP = createNewOTP;
function verifyOTP(phone, otp, hash) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { phone: phoneFromHash, otp: otpFromHash } = (0, jsonwebtoken_1.verify)(hash, KEY);
                resolve(phone === phoneFromHash && otp === otpFromHash);
            }
            catch (error) {
                reject(error);
            }
        }));
    });
}
exports.verifyOTP = verifyOTP;
