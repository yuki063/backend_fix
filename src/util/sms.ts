import axios from "axios";
import convert from "xml-js";

export const sendSMS = async (phoneNumber: string, message: string) => {
  phoneNumber = phoneNumber.replace(/\s/g, "");
  return new Promise(async (resolve, reject) => {
    try {
      let tel = encodeURI(phoneNumber);
      message = encodeURI(message);

      let f = await axios.get(
        // `https://tenetech1:fintech1@smsgw2.gsm.co.za/xml/send/?number=${tel}&message=${message}`
        "https://www.sms123.net/api/send.php?apiKey=017ec0b0f52580519e330d48ca858fcc&type=privateSMS&recipients=" +
    phoneNumber +
    "&messageContent=RM0 This is your promo code " +
    message      );
      if (
        JSON.parse(convert.xml2json(f.data, { compact: true })).aatsms
          .submitresult._attributes.action === "enqueued"
      ) {
        resolve(true);
      } else {
        resolve(false);
      }
    } catch (error) {
      reject(error);
    }
  });
};
export const resetSMS = (otp) => {
  return `Dear User,\n
    ${otp} is your otp for Reset Password.Please Enter the OTP to proceed.\n 
    hurry up the code expires in 5 minutes\n
    Regards\n`;
};

export const registerSMS = (otp) => {
  return `Dear User,\n
    ${otp} is your otp for Phone Number Verfication. Please enter the OTP to verify your phone number.\n
    hurry up the code expires in 5 minutes\n
    Regards\n`;
};
