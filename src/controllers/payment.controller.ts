import { ElectricityPayment } from "./../types/payment";
import { Request, Response } from "express";
import { PAYMENT_API } from "../apis";
import { v4 as uuid } from "uuid";
import {
  errorResponse,
  serverErrorResponse,
  successResponse
} from "../util/api.response";
import { BillPayment } from "../types/bill";
import { MobileAirTimePayment, MobileDataPayment } from "../types/mobile";

export const electricity = async (req: Request, res: Response) => {
  console.log((req as any).user);
  const {
    amount,
    linkedWalletOrCardId,
    meterNumber,
    paymentType,
    transactionType,
    track2Data
  } = <ElectricityPayment>req.body;

  if (
    !amount ||
    !linkedWalletOrCardId ||
    !meterNumber ||
    !paymentType ||
    !transactionType
  ) {
    const missing = [
      "amount",
      "linkedWalletOrCardId",
      "meterNumber",
      "paymentType",
      "transactionType"
    ].filter((item) => !req.body[item]);

    return errorResponse("Invalid request", res, {
      reason: `Missing: ${missing.join(", ")}`
    });
  }

  res.status(200).json({ message: "electricity request success" });
};

export const bill = async (req: Request, res: Response) => {
  const { amount, accountNumber, linkedWalletOrCardId } = <BillPayment>req.body;

  if (!amount || !accountNumber || !linkedWalletOrCardId) {
    const missing = ["amount", "accountNumber", "linkedWalletOrCardId"].filter(
      (item) => !req.body[item]
    );

    return errorResponse("Invalid request", res, {
      reason: `Missing: ${missing.join(", ")}`
    });
  }

  res.status(200).json({ message: "bill request success" });
};

export const mobileAirtime = async (req: Request, res: Response) => {
  try {
    const requestId = uuid();
    const { amount, mobileNumber, vendMetaData, vendorId } = <
      MobileAirTimePayment
    >req.body;

    if (!amount || !vendMetaData || !vendorId || !mobileNumber) {
      const missing = [
        "amount",
        "vendMetaData",
        "vendorId",
        "mobileNumber"
      ].filter((item) => !req.body[item]);

      return errorResponse("Invalid request", res, {
        reason: `Missing: ${missing.join(", ")}`
      });
    }

    const REQUEST_DATA: MobileAirTimePayment = { ...req.body, requestId };

    const request = await PAYMENT_API.post("/mobile/airtime/sales", {
      ...REQUEST_DATA
    });

    const response = await request.data;

    console.log(response);

    res.status(200).json({ message: "mobile airtime request success" });
  } catch (error) {
    console.log(error);
    serverErrorResponse(error, res);
  }
};

export const mobileData = async (req: Request, res: Response) => {
  try {
    const requestId = uuid();
    const { productId, mobileNumber, vendMetaData, vendorId } = <
      MobileDataPayment
    >req.body;

    if (!productId || !vendMetaData || !vendorId || !mobileNumber) {
      const missing = [
        "productId",
        "vendMetaData",
        "vendorId",
        "mobileNumber"
      ].filter((item) => !req.body[item]);

      return errorResponse("Invalid request", res, {
        reason: `Missing: ${missing.join(", ")}`
      });
    }

    const REQUEST_DATA: MobileDataPayment = { ...req.body, requestId };

    const request = await PAYMENT_API.post("/mobile/bundle/sales", {
      ...REQUEST_DATA
    });

    const response = await request.data;

    console.log(response);

    res.status(200).json({ message: "mobile data request success" });
  } catch (error) {
    console.log(error);
    serverErrorResponse(error, res);
  }
};

export const approve = async (req: Request, res: Response) => {
  res.status(200).json({ message: "electricity request success" });
};
