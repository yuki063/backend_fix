import { model, Schema } from "mongoose";
import { IBankCard } from "../types/bankCard";

const bankCardSchema: Schema = new Schema(
  {
    sourceId: {
      // id from stripe
      type: String,
      required: true,
      unique: true,
    },

    nickName: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    deactvation_reason: {
      type: String,
      enum: ["LOST", "STOLEN"],
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

const BankCard = model<IBankCard>("Bank Card", bankCardSchema);
export default BankCard;
