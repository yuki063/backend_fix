"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const wallet_controller_1 = require("../controllers/wallet.controller");
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const transfer_controller_1 = require("../controllers/transfer.controller");
const walletRouter = (0, express_1.Router)();
walletRouter.post("/create-wallet", auth_middleware_1.default, wallet_controller_1.createWallet);
walletRouter.post("/transfer-wallet-wallet", auth_middleware_1.default, transfer_controller_1.walletToWallet);
walletRouter.get("/get-your-wallets", auth_middleware_1.default, wallet_controller_1.getYourWallets);
walletRouter.get("/get-single-wallet", auth_middleware_1.default, wallet_controller_1.getWallet);
exports.default = walletRouter;
