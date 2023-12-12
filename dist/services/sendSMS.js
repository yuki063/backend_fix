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
exports.sendSMS = void 0;
const twilio_config_1 = require("../util/twilio.config");
const sendSMS = (phoneNumber, message) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sentMessage = yield twilio_config_1.client.messages.create({
            body: message,
            from: process.env.localPhoneNumber,
            to: phoneNumber,
        });
        return sentMessage.sid;
    }
    catch (error) {
        throw error;
    }
});
exports.sendSMS = sendSMS;
