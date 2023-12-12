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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPhysicalCards = exports.getVirtualCards = exports.createVirtualCard = void 0;
const physicalCard_model_1 = __importDefault(require("../models/physicalCard.model"));
const virtualCard_model_1 = __importDefault(require("../models/virtualCard.model"));
const api_response_1 = require("../util/api.response");
const stripe_1 = require("../util/stripe");
const validation_1 = require("../util/validation");
const stripe_config_1 = __importDefault(require("../config/stripe.config"));
// create virtual card
const createVirtualCard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error } = validation_1.cardHolderSchema.validate(req.body);
        if (error) {
            return (0, api_response_1.errorResponse)(error.details[0].message, res);
        }
        const cardHolder = yield (0, stripe_1.createCardHolder)(req.body);
        console.log(cardHolder);
        const card = yield stripe_config_1.default.issuing.cards.create({
            cardholder: cardHolder.id,
            currency: "usd",
            type: "virtual",
            status: "active",
        });
        console.log(card);
        return (0, api_response_1.successResponse)("Virtual card created successfully", null, res);
    }
    catch (error) {
        return (0, api_response_1.serverErrorResponse)(error, res);
    }
});
exports.createVirtualCard = createVirtualCard;
const getVirtualCards = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const virtualCards = yield virtualCard_model_1.default.find({
            user: req.user._id,
            status: "ACTIVATED",
        });
        return (0, api_response_1.successResponse)("Virtual cards retrieved successfully", virtualCards, res);
    }
    catch (error) {
        return (0, api_response_1.serverErrorResponse)(error, res);
    }
});
exports.getVirtualCards = getVirtualCards;
const getPhysicalCards = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const physicalCards = yield physicalCard_model_1.default.find({
            user: req.user._id,
            status: "ACTIVATED",
        });
        return (0, api_response_1.successResponse)("Virtual cards retrieved successfully", physicalCards, res);
    }
    catch (error) {
        return (0, api_response_1.serverErrorResponse)(error, res);
    }
});
exports.getPhysicalCards = getPhysicalCards;
