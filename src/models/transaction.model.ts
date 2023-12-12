import { model, Schema } from "mongoose";
import { ITransaction } from "../types/transaction";

const transactionSchema: Schema = new Schema(
  {
    description: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
    fee: {
      type: Number,
      required: true,
    },
    transactionId: {
      // id from stripe
      type: String,
      required: true,
      unique: true,
    },
    issuer: {
      type: String,
      required: true,
    },
    users: {
      type: [{ type: Schema.Types.ObjectId, required: true, ref: "User" }],
      required: true,
    },
    wallets: {
      type: [{ type: Schema.Types.ObjectId, required: true, ref: "Wallet" }],
    },
    sources: {
      type: [{ type: Schema.Types.ObjectId, required: true, ref: "BankCard" }],
    },
    status: {
      type: String,
      enum: ["PENDING", "SUCCESSFULL", "FAILED"],
      default: "PENDING",
    },
  },
  {
    timestamps: true,
  }
);
const Transaction = model<ITransaction>("Transaction", transactionSchema);

export default Transaction;
