import s3 from "../util/aws.config";
import axios from "axios";

export default async function uploadSingleImage(
  file: any,
  folder: "identities" | "selfies",
  subfolder?: string
): Promise<any> {
  return new Promise(async (resolve, reject) => {
    try {
      const filename = `${folder}/${
        folder === "identities" ? subfolder + "/tenet_identity" : "selfie"
      }_${Date.now()}.png`;
      const response = await axios.get(file, { responseType: "arraybuffer" });
      const buffer = Buffer.from(response.data, "utf-8");

      const uploadedImage = await s3
        .upload({
          Bucket: process.env.AWS_S3_BUCKET_NAME!,
          Key: filename,
          Body: buffer,
        })
        .promise();

      resolve(uploadedImage.Location);
    } catch (error) {
      reject(error);
    }
  });
}
