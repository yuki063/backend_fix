import { NextFunction, Response } from "express";
import { errorResponse } from "../util/api.response";

export default function (req: any, res: Response, next: NextFunction) {
  if (!req.user) {
    return errorResponse("Access Denied! You need to login first", res);
  }
  try {
    if (req.user.step < 5) {
      return errorResponse(
        "You have already completed the step",
        res,
        req.user.step
      );
    }
    next();
  } catch (ex) {
    return errorResponse("Invalid token", res);
  }
}
