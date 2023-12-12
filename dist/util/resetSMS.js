"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const resetSMS = (otp) => {
    return (`Dear User,\n` +
        `${otp} is your otp for Reset Password.Please Enter the OTP to proceed.\n` +
        `Regards\n`);
};
exports.default = resetSMS;
