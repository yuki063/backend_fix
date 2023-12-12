import mongoose from "mongoose";
import { NextFunction, Response } from "express";
import { errorResponse } from "../util/api.response";
import jwt from "jsonwebtoken";
import { Request } from "express";
import UserVerification from "../models/userVerification.model";

const { verify } = jwt;

export default async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { code, phoneNumber } = req.body;
    const userVerification = await UserVerification.findOne({
      phoneNumber,
      code,
    });
    if (!userVerification) {
      return errorResponse("Invalid code or Phone number", res);
    }
    const token = userVerification.token;
    verify(token, process.env.JWT_KEY!);
    next();
  } catch (error) {
    return errorResponse("Retry again, Code expired", res);
  }
}
