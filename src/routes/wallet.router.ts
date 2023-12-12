import { Router } from "express";
import { createWallet, getWallet, getYourWallets } from "../controllers/wallet.controller";
import authMiddleware from "../middlewares/auth.middleware";
import { walletToWallet } from "../controllers/transfer.controller";

const walletRouter = Router();
walletRouter.post("/create-wallet", authMiddleware, createWallet);
walletRouter.post("/transfer-wallet-wallet", authMiddleware, walletToWallet);
walletRouter.get("/get-your-wallets", authMiddleware, getYourWallets);
walletRouter.get("/get-single-wallet", authMiddleware, getWallet);

export default walletRouter;
