"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const virtualCardSchema = new mongoose_1.Schema({
    wishedCardName: {
        type: String,
        required: true,
    },
    cardId: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
    },
    status: {
        type: String,
        enum: ["ACTIVATED", "DEACTIVATED"],
        default: "ACTIVATED",
    },
}, {
    timestamps: true,
});
const VirtualCard = (0, mongoose_1.model)("Virtual Card", virtualCardSchema);
exports.default = VirtualCard;
