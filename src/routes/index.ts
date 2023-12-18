import { Router } from "express";
import cardRouter from "./card.router";
import PaymentRouter from "./payment.router";
import userRouter from "./user.router";
import walletRouter from "./wallet.router";


const api = Router();

api.use("/users", userRouter);
api.use("/cards", cardRouter);
api.use("/wallets", walletRouter);
api.use("/payment", PaymentRouter);


export default api;
