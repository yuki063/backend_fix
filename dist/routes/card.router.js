"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bankCard_controller_1 = require("../controllers/bankCard.controller");
const virtualcard_controller_1 = require("../controllers/virtualcard.controller");
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const cardRouter = (0, express_1.Router)();
cardRouter.post("/virtual-card/create", auth_middleware_1.default, virtualcard_controller_1.createVirtualCard);
cardRouter.post("/bank-card/link", auth_middleware_1.default, bankCard_controller_1.linkBankCard);
cardRouter.put("/bank-card/top-up", auth_middleware_1.default, bankCard_controller_1.topUpFromBankCard);
cardRouter.put("/bank-card/withdraw", auth_middleware_1.default, bankCard_controller_1.withdrawFromBankCard);
cardRouter.delete("/bank-card/unlink", auth_middleware_1.default, bankCard_controller_1.unLinkBankCard);
cardRouter.get("/bank-card/get-user-cards", auth_middleware_1.default, bankCard_controller_1.getUserBankCards);
exports.default = cardRouter;
