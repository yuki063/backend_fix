"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const bankCardSchema = new mongoose_1.Schema({
    sourceId: {
        // id from stripe
        type: String,
        required: true,
        unique: true,
    },
    nickName: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
    },
    deactvation_reason: {
        type: String,
        enum: ["LOST", "STOLEN"],
    },
    status: {
        type: String,
        enum: ["ACTIVATED", "DEACTIVATED"],
        default: "ACTIVATED",
    },
}, {
    timestamps: true,
});
const BankCard = (0, mongoose_1.model)("Bank Card", bankCardSchema);
exports.default = BankCard;
