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
const api_response_1 = require("../util/api.response");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userVerification_model_1 = __importDefault(require("../models/userVerification.model"));
const { verify } = jsonwebtoken_1.default;
function default_1(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { code, phoneNumber } = req.body;
            const userVerification = yield userVerification_model_1.default.findOne({
                phoneNumber,
                code,
            });
            if (!userVerification) {
                return (0, api_response_1.errorResponse)("Invalid code or Phone number", res);
            }
            const token = userVerification.token;
            verify(token, process.env.JWT_KEY);
            next();
        }
        catch (error) {
            return (0, api_response_1.errorResponse)("Retry again, Code expired", res);
        }
    });
}
exports.default = default_1;
