import { Response } from "express";

export const successResponse = (
  message: string,
  body: object | [] | null,
  res: Response
) => {
  return res.status(200).json({
    status: 200,
    message: message,
    data: body,
  });
};

export const unAuthorizaedResponse = (message: string, res: Response) => {
  return res.status(401).json({
    status: 401,
    message: message,
  });
};

export const errorResponse = (message: string, res: Response, data?: any) => {
  if (data) {
    return res.status(400).json({
      status: 400,
      message: message,
      data,
    });
  }
  return res.status(400).json({
    status: 400,
    message: message,
  });
};

export const serverErrorResponse = (ex: any, res: Response) => {
  return res.status(500).json({
    status: 500,
    message: "Server Error",
    stackTrace: ex,
  });
};
