"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const { sign } = jsonwebtoken_1.default;
const userSchema = new mongoose_1.Schema({
    password: {
        type: String,
        required: true,
        minLength: 8,
    },
    firstnames: {
        type: String,
        minLength: 3,
    },
    surname: {
        type: String,
    },
    email: {
        type: String,
    },
    gender: {
        type: String,
        enum: ["MALE", "FEMALE"],
    },
    customerId: { type: String },
    address: {
        type: {
            country: String,
            city: String,
            street: String,
            houseNumber: String,
        },
    },
    getNotifications: {
        type: Boolean,
        default: false,
    },
    identity: {
        type: {
            picture: { type: String, required: true },
            identityType: {
                type: String,
                enum: [
                    "LOCAL_PASSPORT",
                    "NATIONAL_ID",
                    "DRIVERS_LICENSE",
                    "ASYLUM_DOCUMENT",
                    "FOREIGN_PASSPORT",
                ],
                required: true,
            },
        },
    },
    selfie: {
        type: String,
    },
    phoneNumber: {
        type: String,
    },
    status: {
        type: String,
        enum: ["ACTIVATED", "DEACTIVATED"],
        default: "ACTIVATED",
    },
    role: {
        type: String,
        enum: ["ADMIN", "CLIENT"],
        default: "CLIENT",
    },
    kycId: {
        type: mongoose_1.Types.ObjectId,
    },
    expiryDate: {
        type: String,
    },
    completedSteps: {
        type: Number,
        default: 3,
    },
    identityNumber: {
        type: String,
    },
}, {
    timestamps: true,
});
userSchema.methods.generateAuthToken = function () {
    let key = process.env.JWT_KEY ? process.env.JWT_KEY.trim() : "";
    let name;
    if (this.surname) {
        if (this.firstnames) {
            name = this.surname + " " + this.firstnames;
        }
        else {
            name = this.surname;
        }
    }
    const token = sign({
        _id: this._id,
        role: this.role,
        customerId: this.customerId,
        email: this.email,
        phoneNumber: this.phoneNumber,
        name,
    }, key);
    return token;
};
userSchema.methods.comparePassword = function (claimedPasscode) {
    return bcrypt_1.default.compareSync(claimedPasscode, this.password);
};
const User = (0, mongoose_1.model)("User", userSchema);
exports.default = User;
