import { ElectricityPayment } from "./../types/payment";
import { Request, Response } from "express";
import { PAYMENT_API } from "../apis";
import { v4 as uuid } from "uuid";
import {
  errorResponse,
  serverErrorResponse,
  successResponse
} from "../util/api.response";
import { BillPayment } from "../types/bill";
import { MobileAirTimePayment, MobileDataPayment } from "../types/mobile";
import Stripe from 'stripe'
import User from '../models/user.model';
export const electricity = async (req: Request, res: Response) => {
  console.log((req as any).user);
  const {
    amount,
    linkedWalletOrCardId,
    meterNumber,
    paymentType,
    transactionType,
    track2Data
  } = <ElectricityPayment>req.body;

  if (
    !amount ||
    !linkedWalletOrCardId ||
    !meterNumber ||
    !paymentType ||
    !transactionType
  ) {
    const missing = [
      "amount",
      "linkedWalletOrCardId",
      "meterNumber",
      "paymentType",
      "transactionType"
    ].filter((item) => !req.body[item]);

    return errorResponse("Invalid request", res, {
      reason: `Missing: ${missing.join(", ")}`
    });
  }

  res.status(200).json({ message: "electricity request success" });
};

export const bill = async (req: Request, res: Response) => {
  const { amount, accountNumber, linkedWalletOrCardId } = <BillPayment>req.body;

  if (!amount || !accountNumber || !linkedWalletOrCardId) {
    const missing = ["amount", "accountNumber", "linkedWalletOrCardId"].filter(
      (item) => !req.body[item]
    );

    return errorResponse("Invalid request", res, {
      reason: `Missing: ${missing.join(", ")}`
    });
  }

  res.status(200).json({ message: "bill request success" });
};

export const mobileAirtime = async (req: Request, res: Response) => {
  try {
    const requestId = uuid();
    const { amount, mobileNumber, vendMetaData, vendorId } = <
      MobileAirTimePayment
    >req.body;

    if (!amount || !vendMetaData || !vendorId || !mobileNumber) {
      const missing = [
        "amount",
        "vendMetaData",
        "vendorId",
        "mobileNumber"
      ].filter((item) => !req.body[item]);

      return errorResponse("Invalid request", res, {
        reason: `Missing: ${missing.join(", ")}`
      });
    }

    const REQUEST_DATA: MobileAirTimePayment = { ...req.body, requestId };

    const request = await PAYMENT_API.post("/mobile/airtime/sales", {
      ...REQUEST_DATA
    });

    const response = await request.data;

    console.log(response);

    res.status(200).json({ message: "mobile airtime request success" });
  } catch (error) {
    console.log(error);
    serverErrorResponse(error, res);
  }
};

export const mobileData = async (req: Request, res: Response) => {
  try {
    const requestId = uuid();
    const { productId, mobileNumber, vendMetaData, vendorId } = <
      MobileDataPayment
    >req.body;

    if (!productId || !vendMetaData || !vendorId || !mobileNumber) {
      const missing = [
        "productId",
        "vendMetaData",
        "vendorId",
        "mobileNumber"
      ].filter((item) => !req.body[item]);

      return errorResponse("Invalid request", res, {
        reason: `Missing: ${missing.join(", ")}`
      });
    }

    const REQUEST_DATA: MobileDataPayment = { ...req.body, requestId };

    const request = await PAYMENT_API.post("/mobile/bundle/sales", {
      ...REQUEST_DATA
    });

    const response = await request.data;

    console.log(response);

    res.status(200).json({ message: "mobile data request success" });
  } catch (error) {
    console.log(error);
    serverErrorResponse(error, res);
  }
};

export const approve = async (req: Request, res: Response) => {
  res.status(200).json({ message: "electricity request success" });
};

const StripeFun = async (email, name, amount, stripe_key) =>{
  console.log(email,name,amount,'pppp')
  const stripe = new Stripe(stripe_key);

  const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: name,
            },
            unit_amount: parseFloat(amount) * 100,
          },
          quantity: 1,
        },
      ],
      customer_email :email ,
      mode: 'payment',
      success_url: process.env.FRONTEND_URL + '/wallet/transfer-wallet-wallet',
      cancel_url : process.env.FRONTEND_URL + '/',
    
    });
    return session.url;

}
export const stripePayment = async (req: Request, res: Response) => {
  const stripe_key = 'sk_test_51OKw5bDgDmJR6QyjWYUU93fed7tAExK7eFgyjjEqv6PBDf3CThAS8hY45SbKCWXN0B03SbcjSqvFbRma7SCKGb2l00nHtA9oZU'
  const { phoneNumber, email, amount} = req.body;
  const senduser = (req as any).user;
  console.log("senduser", senduser);
  var user;
		if (email) {
			user = await User.findOne(
				{
					email,
				},
				{
					status: 0,
					expiryDate: 0,
				}
			);
		} else if (phoneNumber) {
			user = await User.findOne(
				{ phoneNumber },
				{
					status: 0,
					expiryDate: 0,
				}
			);
		} else {
			return errorResponse('Phone number or email is required', res);
		}
    if (!user) {
			if (email) {
				return errorResponse('Invalid email or password', res);
			} else if (phoneNumber) {
				return errorResponse('Invalid phone number or password', res);
			}
		}
    if (senduser.email) {
			user = await User.findOne(
				{
					email,
				},
				{
					status: 0,
					expiryDate: 0,
				}
			);
		} else if (senduser.phoneNumber) {
			user = await User.findOne(
				{ phoneNumber },
				{
					status: 0,
					expiryDate: 0,
				}
			);
		} else {
			return errorResponse('Phone number or email is required', res);
		}
		
    if (amount>=senduser.balance){
      return errorResponse('Enter Correct Amount', res);
    }
    console.log("senduser", senduser);
  console.log(senduser.balance);
  console.log(user.balance);
  
  senduser.balance -= parseInt(amount, 10);
  user.balance += parseInt(amount, 10);
  console.log(user.balance);
  console.log(senduser.balance);
  User.updateOne({email: user.email}, {$set:{balance: user.balance}});
  User.updateOne({email: senduser.email}, {$set:{balance: senduser.balance}});
  const session_url = await StripeFun(user.email, user.name , amount, stripe_key)


  res.status(200).json({ url: session_url });
};
 