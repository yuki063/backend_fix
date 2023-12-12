"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const physicalCardSchema = new mongoose_1.Schema({
    cardNumber: {
        type: String,
        required: true,
    },
    nameOnCard: {
        type: String,
        required: true,
    },
    validThru: {
        type: String,
        required: true,
    },
    cvv: {
        type: Number,
        required: true,
        minLength: 3,
        maxLength: 4,
    },
    wishedCardName: {
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
const PhysicalCard = (0, mongoose_1.model)("Physical Card", physicalCardSchema);
exports.default = PhysicalCard;
