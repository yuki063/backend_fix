import { client } from "../util/twilio.config";

export const sendSMS = async (phoneNumber: string, message: string) => {
  try {
    const sentMessage = await client.messages.create({
      body: message,
      from: process.env.localPhoneNumber!,
      to: phoneNumber,
    });
    return sentMessage.sid;
  } catch (error: any) {
    throw error;
  }
};

