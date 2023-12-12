import { Router } from "express";
import {
  errorResponse,
  serverErrorResponse,
  successResponse,
} from "../util/api.response";
import {
  activateUser,
  analyzeUserDocuments,
  createUserWithPassword,
  deactivateUser,
  getUserData,
  getUserHome,
  login,
  newPassword,
  registerEmail,
  registerPhoneNumber,
  resendCode as resendOTP,
  resetPassword,
  uploadIdentity,
  uploadPersonalInformation,
  uploadSelfie,
  verifyWithOTP,
} from "../controllers/user.controller";
import adminMiddleware from "../middlewares/admin.middleware";
import authMiddleware from "../middlewares/auth.middleware";
import User from "../models/user.model";
import { createCustomer } from "../util/stripe";

const userRouter = Router();
userRouter.put("/reset-passwrod/update", newPassword);
userRouter.get(
  "/create-stripe-customer",
  authMiddleware,
  async (req: any, res) => {
    try {
      const customerId = await createCustomer({
        email: req.user.email,
        phone: req.user.phoneNumber,
        name: req.user.surname + " " + req.user.firstnames,
      });
      await User.findByIdAndUpdate(req.user._id, { customerId });
      return successResponse(
        "created customer successfully",
        { customerId },
        res
      );
    } catch (error) {
      return serverErrorResponse(error, res);
    }
    
  }
);
userRouter.post("/signup/register-phone-number", registerPhoneNumber);
userRouter.put(
  "/signup/upload-personal-information",
  authMiddleware,
  uploadPersonalInformation
);
userRouter.post("/signup/register-email", registerEmail);
userRouter.get("/get-user-home", authMiddleware, getUserHome);
userRouter.put(
  "/signup/upload-identity-document",
  authMiddleware,
  uploadIdentity
);

userRouter.get("/get-user-data", authMiddleware, getUserData);

userRouter.put("/signup/upload-selfie", authMiddleware, uploadSelfie);
userRouter.post("/signup/resend-code", (req, res) => {
  resendOTP(req, res, "signup");
});
userRouter.post("/reset-password/resend-code", (req, res) => {
  resendOTP(req, res, "reset");
});

userRouter.post("/signup/create-user-with-password", createUserWithPassword);

userRouter.get("/signup/analyze-user", authMiddleware, analyzeUserDocuments);
userRouter.post("/verify-otp", verifyWithOTP);
userRouter.put("/activate-user", adminMiddleware, activateUser);
userRouter.delete("/deactivate-user", adminMiddleware, deactivateUser);
userRouter.post("/reset-password", resetPassword);
userRouter.post("/login", login);

export default userRouter;
