"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userVerificationSchema = new mongoose_1.Schema({
    phoneNumber: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        minLength: 4,
        maxLength: 4,
    },
    getNotifications: {
        type: Boolean,
        default: false,
    },
    status: {
        type: String,
        enum: ["VERIFIIED", "NOT VERIFIED"],
        default: "NOT VERIFIED",
    },
    token: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});
userVerificationSchema.methods.compareCodes = function (code) {
    return this.code === code;
};
userVerificationSchema.methods.generateNewCode = function () {
    const code = Math.floor(1000 + Math.random() * 9000);
    this.code = code;
    // restart the timer
    this.save();
    return code;
};
const UserVerification = (0, mongoose_1.model)("User Verification", userVerificationSchema);
exports.default = UserVerification;
