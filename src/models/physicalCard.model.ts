import { model, Schema } from "mongoose";
import { IWallet } from "../types/wallet";

const physicalCardSchema: Schema = new Schema(
  {
    cardNumber: {
      type: String,
      required: true,
    },
    nameOnCard: {
      type: String,
      required: true,
    },
    validThru: {
      type: String,
      required: true,
    },
    cvv: {
      type: Number,
      required: true,
      minLength: 3,
      maxLength: 4,
    },
    wishedCardName: {
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

const PhysicalCard = model("Physical Card", physicalCardSchema);
export default PhysicalCard;
