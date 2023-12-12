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
// create virtual card
const createVirtualCard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const virtualCard = yield virtualCard_model_1.default.create(req.body);
        // CREATE VIRTUAL CARD WITH PAYPAL
        return (0, api_response_1.successResponse)("Virtual card created successfully", virtualCard, res);
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
