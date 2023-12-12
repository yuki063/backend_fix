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
const express_1 = require("express");
const api_response_1 = require("../util/api.response");
const user_controller_1 = require("../controllers/user.controller");
const admin_middleware_1 = __importDefault(require("../middlewares/admin.middleware"));
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const user_model_1 = __importDefault(require("../models/user.model"));
const stripe_1 = require("../util/stripe");
const userRouter = (0, express_1.Router)();
userRouter.put("/reset-passwrod/update", user_controller_1.newPassword);
userRouter.get("/create-stripe-customer", auth_middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customerId = yield (0, stripe_1.createCustomer)({
            email: req.user.email,
            phone: req.user.phoneNumber,
            name: req.user.surname + " " + req.user.firstnames,
        });
        yield user_model_1.default.findByIdAndUpdate(req.user._id, { customerId });
        return (0, api_response_1.successResponse)("created customer successfully", { customerId }, res);
    }
    catch (error) {
        return (0, api_response_1.serverErrorResponse)(error, res);
    }
}));
userRouter.post("/signup/register-phone-number", user_controller_1.registerPhoneNumber);
userRouter.put("/signup/upload-personal-information", auth_middleware_1.default, user_controller_1.uploadPersonalInformation);
userRouter.post("/signup/register-email", user_controller_1.registerEmail);
userRouter.get("/get-user-home", auth_middleware_1.default, user_controller_1.getUserHome);
userRouter.put("/signup/upload-identity-document", auth_middleware_1.default, user_controller_1.uploadIdentity);
userRouter.get("/get-user-data", auth_middleware_1.default, user_controller_1.getUserData);
userRouter.put("/signup/upload-selfie", auth_middleware_1.default, user_controller_1.uploadSelfie);
userRouter.post("/signup/resend-code", (req, res) => {
    (0, user_controller_1.resendCode)(req, res, "signup");
});
userRouter.post("/reset-password/resend-code", (req, res) => {
    (0, user_controller_1.resendCode)(req, res, "reset");
});
userRouter.post("/signup/create-user-with-password", user_controller_1.createUserWithPassword);
userRouter.get("/signup/analyze-user", auth_middleware_1.default, user_controller_1.analyzeUserDocuments);
userRouter.post("/verify-otp", user_controller_1.verifyWithOTP);
userRouter.put("/activate-user", admin_middleware_1.default, user_controller_1.activateUser);
userRouter.delete("/deactivate-user", admin_middleware_1.default, user_controller_1.deactivateUser);
userRouter.post("/reset-password", user_controller_1.resetPassword);
userRouter.post("/login", user_controller_1.login);
exports.default = userRouter;
