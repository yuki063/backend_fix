import { Response } from "express";
import { serverErrorResponse, successResponse } from "../util/api.response";
import stripeConfig from "../config/stripe.config";
import Wallet from "../models/wallet.model";

export const walletToWallet = async (req: any, res: Response) => {
  try {
    const { amount, sourceCustomerId, destinationCustomerId } = req.body;

    const charge = await stripeConfig.charges.create({
      amount: amount,
      currency: "zar",
      customer: sourceCustomerId,
    });
    await Wallet.findOneAndUpdate(
      {
        walletId: sourceCustomerId,
      },
      {
        $inc: { balance: -amount },
      }
    );
    // Transfer the amount from the source customer to the destination customer
    await stripeConfig.transfers.create({
      amount: amount,
      currency: "usd",
      destination: destinationCustomerId,
    });
    await Wallet.findOneAndUpdate(
      {
        walletId: destinationCustomerId,
      },
      {
        $inc: { balance: amount },
      }
    );
    return successResponse(
      "you have transfered your money to another wallet successfully",
      null,
      res
    );
  } catch (error) {
    return serverErrorResponse(error, res);
  }
};
export const confirmElectricityMeterNumber = async (
  req: Request,
  res: Response
) => {
  try {
    // const { meterNumber } = req.body;
    // const 
  } catch (error) {
    return serverErrorResponse(error, res);
  }
};
export const buyElectricity = async (req: Request, res: Response) => {
  try {
    // const { meterNumber, amount } = req.body;
    
  } catch (error) {
    return serverErrorResponse(error, res);
  }
};
