import { model, Schema } from "mongoose";
import { IWallet } from "../types/wallet";

const virtualCardSchema: Schema = new Schema(
  {
    wishedCardName: {
      type: String,
      required: true,
    },
    cardId: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
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

const VirtualCard = model<IWallet>("Virtual Card", virtualCardSchema);
export default VirtualCard;
