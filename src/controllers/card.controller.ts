import { Request, Response } from "express";
import PhysicalCard from "../models/physicalCard.model";
import VirtualCard from "../models/virtualCard.model";
import { serverErrorResponse, successResponse } from "../util/api.response";

// create virtual card
export const createVirtualCard = async (req: Request, res: Response) => {
  try {
    const virtualCard = await VirtualCard.create(req.body);
    // CREATE VIRTUAL CARD WITH PAYPAL
    return successResponse(
      "Virtual card created successfully",
      virtualCard,
      res
    );
  } catch (error) {
    return serverErrorResponse(error, res);
  }
};
export interface CustomRequest extends Request {
  user: {
    _id: string;
    step: number;
  };
}

export const getVirtualCards = async (req: CustomRequest, res: Response) => {
  try {
    const virtualCards = await VirtualCard.find({
      user: req.user._id,
      status: "ACTIVATED",
    });
    return successResponse(
      "Virtual cards retrieved successfully",
      virtualCards,
      res
    );
  } catch (error) {
    return serverErrorResponse(error, res);
  }
};

export const getPhysicalCards = async (req: CustomRequest, res: Response) => {
  try {
    const physicalCards = await PhysicalCard.find({
      user: req.user._id,
      status: "ACTIVATED",
    });
    return successResponse(
      "Virtual cards retrieved successfully",
      physicalCards,
      res
    );
  } catch (error) {
    return serverErrorResponse(error, res);
  }
};
