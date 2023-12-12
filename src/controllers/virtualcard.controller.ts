import { Request, Response } from "express";
import PhysicalCard from "../models/physicalCard.model";
import VirtualCard from "../models/virtualCard.model";
import {
  errorResponse,
  serverErrorResponse,
  successResponse,
} from "../util/api.response";
import { createCardHolder } from "../util/stripe";
import { cardHolderSchema } from "../util/validation";
import stripeConfig from "../config/stripe.config";

// create virtual card
export const createVirtualCard = async (req: Request, res: Response) => {
  try {
    const { error } = cardHolderSchema.validate(req.body);
    if (error) {
      return errorResponse(error.details[0].message, res);
    }
    const cardHolder : any = await createCardHolder(req.body);
    console.log(cardHolder)
    const card = await stripeConfig.issuing.cards.create({
      cardholder: cardHolder.id,
      currency: "usd",
      type: "virtual",
      status: "active",
    });
    console.log(card);
    return successResponse("Virtual card created successfully", null, res);
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
