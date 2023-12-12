import AWS from "aws-sdk";

export const sendSMS = async (phoneNumber: string, message: string) => {
  return new Promise(async (resolve, reject) => {
    var params = {
      Message: message /* required */,
      PhoneNumber: phoneNumber,
    };
    try {
      var publishTextPromise = new AWS.SNS({ apiVersion: "2010-03-31" })
        .publish(params)
        .promise();

      const data = await publishTextPromise;
      resolve(data);
    } catch (error) {
      reject(error);
    }
  });
};
