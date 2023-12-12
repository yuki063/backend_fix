import { Router } from "express";
import {
  linkBankCard,
  unLinkBankCard,
  topUpFromBankCard,
  withdrawFromBankCard,
  getUserBankCards,
} from "../controllers/bankCard.controller";
import { createVirtualCard } from "../controllers/virtualcard.controller";
import authMiddleware from "../middlewares/auth.middleware";
const cardRouter = Router();

cardRouter.post("/virtual-card/create", authMiddleware, createVirtualCard);
cardRouter.post("/bank-card/link", authMiddleware, linkBankCard);
cardRouter.put("/bank-card/top-up", authMiddleware, topUpFromBankCard);
cardRouter.put("/bank-card/withdraw", authMiddleware, withdrawFromBankCard);
cardRouter.delete("/bank-card/unlink", authMiddleware, unLinkBankCard);
cardRouter.get("/bank-card/get-user-cards", authMiddleware, getUserBankCards)

export default cardRouter;
