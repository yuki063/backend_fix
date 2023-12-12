import mongoose from "mongoose";
import { NextFunction, Response } from "express";
import { errorResponse } from "../util/api.response";
import jwt from "jsonwebtoken";
import { Request } from "express";

const { verify } = jwt;

export default function (req: Request, res: Response, next: NextFunction) {
  if (!req.header("Authorization"))
    return errorResponse("Access Denied! You need to login first", res);

  const token: string | undefined = req
    .header("Authorization")
    ?.trim()
    ?.replace("Bearer ", "");

  if (!token)
    return errorResponse("Access Denied! You need to login first", res);
  try {
    let key: string = process.env.JWT_KEY ? process.env.JWT_KEY.trim() : "";

    const decoded = verify(token, key) as any;
    (req as any).user = decoded;
    console.log(decoded);
    if (decoded.role != "ADMIN")
      return errorResponse(
        "Access Denied! You must be an admin to use this route!",
        res
      );
    next();
  } catch (ex) {
    return errorResponse("Invalid token", res);
  }
}
