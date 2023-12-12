import { Router } from "express";
import {
  electricity,
  mobileAirtime,
  mobileData,
  approve,
  bill
} from "../controllers/payment.controller";
import authMiddleware from "../middlewares/auth.middleware";

const PaymentRouter = Router();

PaymentRouter.post("/bill", authMiddleware, bill);
PaymentRouter.post("/electricity", authMiddleware, electricity);
PaymentRouter.post("/mobile-airtime", authMiddleware, mobileAirtime);
PaymentRouter.post("/mobile-data", authMiddleware, mobileData);

PaymentRouter.post("/approve", authMiddleware, approve);

export default PaymentRouter;
