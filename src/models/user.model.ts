import { model, Schema, Types } from "mongoose";
import jsonwebtoken from "jsonwebtoken";
import { IUser } from "../types/user";
import bcrypt from "bcrypt";

const { sign } = jsonwebtoken;

const userSchema: Schema = new Schema(
  {
    password: {
      type: String,
      required: true,
      minLength: 8,
    },
    firstnames: {
      type: String,
      minLength: 3,
    },
    surname: {
      type: String,
    },
    email: {
      type: String,
    },
    gender: {
      type: String,
      enum: ["MALE", "FEMALE"],
    },
    customerId: { type: String },
    address: {
      type: {
        country: String,
        city: String,
        street: String,
        houseNumber: String,
      },
    },
    getNotifications: {
      type: Boolean,
      default: false,
    },
    identity: {
      type: {
        picture: { type: String, required: true },
        identityType: {
          type: String,
          enum: [
            "LOCAL_PASSPORT",
            "NATIONAL_ID",
            "DRIVERS_LICENSE",
            "ASYLUM_DOCUMENT",
            "FOREIGN_PASSPORT",
          ],
          required: true,
        },
      },
    },
    selfie: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
    status: {
      type: String,
      enum: ["ACTIVATED", "DEACTIVATED"],
      default: "ACTIVATED",
    },
    role: {
      type: String,
      enum: ["ADMIN", "CLIENT"],
      default: "CLIENT",
    },
    kycId: {
      type: Types.ObjectId,
    },
    expiryDate: {
      type: String,
    },
    completedSteps: {
      type: Number,
      default: 3,
    },
    identityNumber: {
      type: String,
    },
    balance: {
      type: Number,
      default:0,
    },
    name: {
      type: String,
      default:'text',
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.generateAuthToken = function (): string {
  let key: string = process.env.JWT_KEY ? process.env.JWT_KEY.trim() : "";
  let name;
  if (this.surname) {
    if (this.firstnames) {
      name = this.surname + " " + this.firstnames;
    } else {
      name = this.surname;
    }
  }
  const token = sign(
    {
      _id: this._id,
      role: this.role,
      customerId: this.customerId,
      email: this.email,
      phoneNumber: this.phoneNumber,
      name,
    },
    key
  );
  return token;
};

userSchema.methods.comparePassword = function (
  claimedPasscode: string
): boolean {
  return bcrypt.compareSync(claimedPasscode, this.password);
};
const User = model<IUser>("User", userSchema);
export default User;
