"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const registerSMS = (otp) => {
    return (`Dear User,\n` +
        `${otp} is your otp for Phone Number Verfication. Please enter the OTP to verify your phone number.\n` +
        `Regards\n`);
};
exports.default = registerSMS;
