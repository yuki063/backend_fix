import { model, Schema } from "mongoose";

const userVerificationSchema: Schema = new Schema(
  {
    phoneNumber: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      minLength: 4,
      maxLength: 4,
    },
    getNotifications: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["VERIFIIED", "NOT VERIFIED"],
      default: "NOT VERIFIED",
    },
    token: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
userVerificationSchema.methods.compareCodes = function (code: number): boolean {
  return this.code === code;
};

userVerificationSchema.methods.generateNewCode = function (): number {
  const code: number = Math.floor(1000 + Math.random() * 9000);
  this.code = code;
  // restart the timer
  this.save();
  return code;
};
const UserVerification = model("User Verification", userVerificationSchema);
export default UserVerification;
