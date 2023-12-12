import { Response } from "express";
import { serverErrorResponse, successResponse } from "../util/api.response";
import stripeConfig from "../config/stripe.config";
import Transaction from "../models/transaction.model";

const withdraw = async (req: any, res: Response) => {
  try {
    const { sourceId, currency, amount } = req.body;
    await stripeConfig.payouts.create({
      amount,
      currency,
      destination: sourceId,
    });
    return successResponse(
      "You have withdrawn money from your wallet to your card number",
      null,
      res
    );
  } catch (error) {
    return serverErrorResponse(error, res);
  }
};



const cancelCard = async (req: any, res: Response) => {
  try {
    await stripeConfig.issuing.cards.update("card_id", {
      status: "canceled",
      cancellation_reason: "lost, stolen",
    });
  } catch (error) {
    return serverErrorResponse(error, res);
  }
};

const transferWalletToWallet = async (req: any, res: Response) => {
  try {
    const { sourceCustomerId, destinationCustomerId, amount } = req.body;
    // Create a charge on the source customer
    const charge = await stripeConfig.charges.create({
      amount: amount,
      currency: "usd",
      customer: sourceCustomerId,
    });

    // Transfer the amount from the source customer to the destination customer
    await stripeConfig.transfers.create({
      amount: amount,
      currency: "usd",
      destination: destinationCustomerId,
    });

    console.log("Transfer completed successfully");
  } catch (error) {
    return serverErrorResponse(error, res);
  }
};

const getTransaction = async (req: any, res: Response) => {
  const transactions = await Transaction.aggregate([
    {
      $match: {
        user: req.user._id,
        wallet: "wallet id"
      },
      $group: {
        _id: "$date",
        
      }
    },
  ]);
};
