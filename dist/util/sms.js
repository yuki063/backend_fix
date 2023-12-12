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
exports.registerSMS = exports.resetSMS = exports.sendSMS = void 0;
const axios_1 = __importDefault(require("axios"));
const xml_js_1 = __importDefault(require("xml-js"));
const sendSMS = (phoneNumber, message) => __awaiter(void 0, void 0, void 0, function* () {
    phoneNumber = phoneNumber.replace(/\s/g, "");
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let tel = encodeURI(phoneNumber);
            message = encodeURI(message);
            let f = yield axios_1.default.get(
            // `https://tenetech1:fintech1@smsgw2.gsm.co.za/xml/send/?number=${tel}&message=${message}`
            "https://www.sms123.net/api/send.php?apiKey=017ec0b0f52580519e330d48ca858fcc&type=privateSMS&recipients=" +
                phoneNumber +
                "&messageContent=RM0 This is your promo code " +
                message);
            if (JSON.parse(xml_js_1.default.xml2json(f.data, { compact: true })).aatsms
                .submitresult._attributes.action === "enqueued") {
                resolve(true);
            }
            else {
                resolve(false);
            }
        }
        catch (error) {
            reject(error);
        }
    }));
});
exports.sendSMS = sendSMS;
const resetSMS = (otp) => {
    return `Dear User,\n
    ${otp} is your otp for Reset Password.Please Enter the OTP to proceed.\n 
    hurry up the code expires in 5 minutes\n
    Regards\n`;
};
exports.resetSMS = resetSMS;
const registerSMS = (otp) => {
    return `Dear User,\n
    ${otp} is your otp for Phone Number Verfication. Please enter the OTP to verify your phone number.\n
    hurry up the code expires in 5 minutes\n
    Regards\n`;
};
exports.registerSMS = registerSMS;
