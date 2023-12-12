import { model, Schema } from "mongoose";
import { IWallet } from "../types/wallet";

const walletSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    balance: {
      type: Number,
      default: 0,
    },
    availableBalance: {
      type: Number,
      default: 0,
    },
    kind: {
      type: String,
      enum: ["WALLET_ONLY", "VIRTUAL_CARD"],
    },
    currency: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: ["ACTIVATED", "DEACTIVATED"],
      default: "ACTIVATED",
    },
  },
  {
    timestamps: true,
  }
);

const Wallet = model<IWallet>("Wallet", walletSchema);
export default Wallet;
