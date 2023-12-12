import AWS from "aws-sdk";

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
});

AWS.config.update({
  region: "us-east-1",
  accessKeyId: "AKIA37OUYA7CPUPLAFKL",
  secretAccessKey: "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",
});
const client = new AWS.Rekognition();
export { client };
export default s3;
