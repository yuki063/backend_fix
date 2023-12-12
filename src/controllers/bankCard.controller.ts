import { Response } from "express";
import BankCard from "../models/bankCard.model";
import { createStripeToken, getParams } from "../util/stripe";
import { bankCardSchema, bankCardTopUpSchema } from "../util/validation";
import {
  errorResponse,
  serverErrorResponse,
  successResponse,
} from "../util/api.response";
import stripeConfig from "../config/stripe.config";
import { CustomRequest } from "./virtualcard.controller";
import Wallet from "../models/wallet.model";
import { checkCard } from "../util/card";
import User from "../models/user.model";
import Transaction from "../models/transaction.model";

export const topUpFromBankCard = async (req: any, res: Response) => {
  try {
    var { amount, walletId, currency = "ZAR", bankCardId } = req.body;
    if (!bankCardId) {
      return errorResponse("Invalid bank card", res);
    }
    let bankCard = await BankCard.findById(bankCardId, { sourceId: 1 });
    if (!bankCard) {
      return errorResponse("Invalid bank card", res);
    }
    let sourceId = bankCard.sourceId;
    const { error } = bankCardTopUpSchema.validate({
      amount,
      sourceId,
      walletId,
    });
    if (error) {
      return errorResponse(error.details[0].message, res);
    }
    let charge = await stripeConfig.charges.create({
      amount: amount * 100,
      currency,
      customer: req.user.customerId,
      source: sourceId,
      description: "Transfer from linked card to wallet",
    });

    const balanceTransactionId = charge.balance_transaction;
    const balanceTransaction = await stripeConfig.balanceTransactions.retrieve(
      balanceTransactionId
    );

    const fee = balanceTransaction.fee;
    
    await Wallet.findByIdAndUpdate(walletId, {
      $inc: { balance: amount, availableBalance: amount },
    });
    let transaction = new Transaction({
      description: "Transfer from linked card to wallet",
      amount,
      transactionId: charge.id,
      users: [req.user._id],
      issuer: req.user._id,
      currency,
      fee,
      wallets: [walletId],
      sources: [bankCardId],
      status: "SUCCESSFULL",
    });
    await transaction.save();
    return successResponse(
      "You have successfully transferred money from your card to the wallet",
      null,
      res
    );
  } catch (error) {
    console.log(error);
    return serverErrorResponse(error, res);
  }
};
export const getUserBankCards = async (req: any, res: Response) => {
  try {
    const bankcards = await BankCard.find(
      {
        user: req.user._id,
      },
      {
        sourceId: 0,
        user: 0,
      }
    );
    return successResponse(
      "User's bank cards retrieved successfully",
      bankcards,
      res
    );
  } catch (error) {
    return serverErrorResponse(error, res);
  }
};

export const linkBankCard = async (req: any, res: Response) => {
  try {
    const { error } = bankCardSchema.validate(req.body);
    if (error) {
      return errorResponse(error.details[0].message, res);
    }

    let exp_month = Number(
      req.body.thru.replace(/[\/]/g, "").padStart(4, "0").slice(0, 2)
    );
    let exp_year = Number(
      req.body.thru.replace(/[\/]/g, "").slice(2).padStart(4, "20")
    );
    // check if you've linked the card before
    checkCard(
      req.user.customerId,
      req.body.cardNumber.replace(/[\s-]/g, ""),
      exp_month,
      exp_year,
      req.body.nickName
    )
      .then(async (_) => {
        try {
          const token = await createStripeToken(
            req.body.nameOnCard,
            req.body.cardNumber.replace(/[\s-]/g, ""),
            exp_month,
            exp_year,
            req.body.cvv
          );
          let params = getParams(req.user);
          const source = await stripeConfig.sources.create({
            type: "card",
            token,
            currency: "zar",
            owner: {
              ...params,
              address: {
                country: "ZA",
              },
            },
          });
          await stripeConfig.customers.createSource(req.user.customerId, {
            source: source.id,
            metadata: {
              card_name: req.body.nameOnCard,
              user_given_name: req.body.nickName,
            },
          });
          await BankCard.create({
            user: req.user._id,
            sourceId: source.id,
            nickName: req.body.nickName,
          });
          return successResponse("Your card has been linked", null, res);
        } catch (err) {
          return serverErrorResponse(err, res);
        }
      })
      .catch((err) => {
        return errorResponse(err, res);
      });
  } catch (error) {
    return serverErrorResponse(error, res);
  }
};

export const withdrawFromBankCard = async (req: any, res: Response) => {
  try {
    const { sourceId, currency = "zar", amount, walletId } = req.body;
    const wallet = await Wallet.findOne({ walletId }, { balance: 1 });
    if (!wallet) {
      return errorResponse("Wallet not exist", res);
    }
    if (wallet.balance < amount) {
      return errorResponse("You can withdraw this amount", res);
    }
    await stripeConfig.transfers.create({
      amount,
      currency,
      destination: sourceId,
      transfer_group: "group_id_1",
      source_transaction: walletId,
    });

    await Wallet.findOneAndUpdate(
      { walletId },
      {
        $inc: { balance: -amount },
      }
    );
    // you now have this balance remember to add it
    return successResponse(
      "You have successfully withrawn " + amount + " from your wallet",
      null,
      res
    );
  } catch (error) {
    return serverErrorResponse(error, res);
  }
};

export const unLinkBankCard = async (req: any, res: Response) => {
  try {
    const { id }: { id: string } = req.body;
    await stripeConfig.customers.deleteSource(req.user.customerId, id);
    await BankCard.findByIdAndUpdate(id, {
      status: "DEACTIVATED",
    });
    return successResponse("Your card has been deleted", null, res);
  } catch (error) {
    serverErrorResponse(error, res);
  }
};
