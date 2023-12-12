import { Request, Response } from "express";
import {
  errorResponse,
  serverErrorResponse,
  successResponse,
} from "../util/api.response";
import { walletSchema } from "../util/validation";
import Wallet from "../models/wallet.model";
import { createCustomer } from "../util/stripe";
import stripeConfig from "../config/stripe.config";

export const getWallet = async (req: any, res: Response) => {
  try {
    const { id } = req.query;
    const wallet = await Wallet.findOne(
      {
        _id: id,
        user: req.user._id,
        status: "ACTIVATED",
      },
      {
        balance: 1,
        availableBalance: 1,
        name: 1,
      }
    );
    return successResponse("Wallet retrieved successfully", wallet, res);
  } catch (error) {
    return serverErrorResponse(error, res);
  }
};

export const createWallet = async (req: any, res: Response) => {
  try {
    const { email, phoneNumber, currency = "zar", name, kind } = req.body;
    if (!email && !phoneNumber) {
      return errorResponse("Enter your phone number or email", res);
    }
    const { error } = walletSchema.validate({ kind, name });
    if (error) {
      return errorResponse(error.details[0].message, res);
    }
    if (kind !== "WALLET_ONLY" && kind !== "VIRTUAL_CARD") {
      return errorResponse("Invalid wallet kind", res);
    }

    const wallet = new Wallet({
      currency,
      user: req.user._id,
      kind,
      name,
    });
    await wallet.save();
    return successResponse("Wallet created successfully", null, res);
  } catch (error) {
    console.log(error);
    return serverErrorResponse(error, res);
  }
};

export const getYourWallets = async (req: any, res: Response) => {
  try {
    const wallets = await Wallet.find(
      {
        user: req.user._id,
        status: "ACTIVATED",
      },
      {
        name: 1,
        balance: 1,
        availableBalance: 1,
      }
    );
    return successResponse("Wallets retrieved successfully", wallets, res);
  } catch (error) {
    return serverErrorResponse(error, res);
  }
};

export const topUpWallet = async (req: any, res: Response) => {};
