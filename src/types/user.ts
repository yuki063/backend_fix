import { Document } from "mongoose";

export interface IUser extends Document {
  firstnames: string;
  surname: string;
  password: string;
  email: string;
  identity: {
    identityType: string;
    picture: string;
  };
  selfie: string;
  phoneNumber: string;
  status: string;
  role: string;
  identityNumber: string;
  expiryDate: string;
  completedSteps: number;
  generateAuthToken: () => string;
  comparePassword: (claimedPasscode: string) => boolean;
}
