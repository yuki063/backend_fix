"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const transactionSchema = new mongoose_1.Schema({
    description: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    currency: {
        type: String,
        required: true,
    },
    fee: {
        type: Number,
        required: true,
    },
    transactionId: {
        // id from stripe
        type: String,
        required: true,
        unique: true,
    },
    issuer: {
        type: String,
        required: true,
    },
    users: {
        type: [{ type: mongoose_1.Schema.Types.ObjectId, required: true, ref: "User" }],
        required: true,
    },
    wallets: {
        type: [{ type: mongoose_1.Schema.Types.ObjectId, required: true, ref: "Wallet" }],
    },
    sources: {
        type: [{ type: mongoose_1.Schema.Types.ObjectId, required: true, ref: "BankCard" }],
    },
    status: {
        type: String,
        enum: ["PENDING", "SUCCESSFULL", "FAILED"],
        default: "PENDING",
    },
}, {
    timestamps: true,
});
const Transaction = (0, mongoose_1.model)("Transaction", transactionSchema);
exports.default = Transaction;
