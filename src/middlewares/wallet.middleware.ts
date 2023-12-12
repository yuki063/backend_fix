import { NextFunction, Response } from "express";
import { errorResponse } from "../util/api.response";
import { Request } from "express";
import Wallet from "../models/wallet.model";

export default async function (req: any, res: Response, next: NextFunction) {
  try {
    const validwallet = await Wallet.findOne(
      { user: req.user._id, _id: req.body.walletId, status: "ACTIVATED" },
      {
        _id: 0,
      }
    );

    if (!validwallet) {
      return errorResponse(
        "You don't have a wallet yet, or you selected unavailable wallet",
        res
      );
    }
    next();
  } catch (error) {
    return errorResponse("Retry again, Code expired", res);
  }
}
