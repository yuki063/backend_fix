"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const walletSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    balance: {
        type: Number,
        default: 0,
    },
    availableBalance: {
        type: Number,
        default: 0,
    },
    kind: {
        type: String,
        enum: ["WALLET_ONLY", "VIRTUAL_CARD"],
    },
    currency: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    status: {
        type: String,
        enum: ["ACTIVATED", "DEACTIVATED"],
        default: "ACTIVATED",
    },
}, {
    timestamps: true,
});
const Wallet = (0, mongoose_1.model)("Wallet", walletSchema);
exports.default = Wallet;
