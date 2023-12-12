import axios from "axios";
import s3, { client } from "../config/aws.config";

export async function uploadSingleImage(
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

export const compareFaces = async (
  photo_source: string,
  photo_target: string
): Promise<boolean> => {
  return new Promise(async (resolve, reject) => {
    try {
      const params = {
        SourceImage: {
          S3Object: {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Name: photo_source,
          },
        },
        TargetImage: {
          S3Object: {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Name: photo_target,
          },
        },
        SimilarityThreshold: 70,
      };
      const data = await client.compareFaces(params).promise();
      const n = data.FaceMatches?.map((data) => {
        let similarity = data!.Similarity;
        return similarity;
      });
      resolve(n![0]! > 90);
    } catch (error) {
      reject(error);
    }
  });
};

export const detectText = async (
  image: string,
  type:
    | "LOCAL_PASSPORT"
    | "NATIONAL_ID"
    | "DRIVERS_LICENSE"
    | "ASYLUM_DOCUMENT"
    | "FOREIGN_PASSPORT"
): Promise<{
  firstnames: string;
  surname: string;
  idNumber: string;
  expiryDate: string;
}> => {
  return new Promise(async (resolve, reject) => {
    try {
      const params = {
        Image: {
          S3Object: {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Name: image,
          },
        },
      };
      const data = await client.detectText(params).promise();
      let surname;
      let firstnames;
      
      let idNumber;
      let expiryDate;
      data.TextDetections?.map((label, index) => {
        if (label.Type === "LINE") {
          if (label.DetectedText?.toUpperCase().includes("SURNAME")) {
            surname = data.TextDetections![index + 1].DetectedText;
          }
          if (
            label.DetectedText?.toUpperCase().includes("LAST NAME") ||
            label.DetectedText?.toUpperCase().includes("GIVEN NAMES") ||
            label.DetectedText?.toUpperCase().includes("PRÉNOMS") ||
            label.DetectedText?.toUpperCase().includes("NAMES")
          ) {
            firstnames = data.TextDetections![index + 1].DetectedText;
          }
          if (label.DetectedText?.toUpperCase().includes("ID NUMBER")) {
            idNumber = data.TextDetections![index + 1].DetectedText;
          }
          if (label.DetectedText?.toUpperCase().includes("EXPIRY DATE")) {
            expiryDate = data.TextDetections![index + 1].DetectedText;
          }
          if (
            label.DetectedText?.toUpperCase().includes("IDENTITY NUMBER") ||
            label.DetectedText?.toUpperCase().includes("NATIONAL ID NO") ||
            label.DetectedText?.toUpperCase().includes(
              "NATIONAL IDENTITY NUMBER"
            ) ||
            label.DetectedText?.toUpperCase().includes(
              "NATIONAL IDENTITY NO"
            ) ||
            label.DetectedText?.toUpperCase().includes("IDENTITY NO") ||
            label.DetectedText?.toUpperCase().includes("NO D'IDENTITÉ")
          ) {
            idNumber = data.TextDetections![index + 1].DetectedText;
            if (!idNumber.replace(/[\s-]/g, "").match(/[0-9]{8,}/)) {
              idNumber = data.TextDetections![index + 2].DetectedText;
            }
          }
          if (type !== "NATIONAL_ID") {
            if (
              label.DetectedText?.toUpperCase().includes("DATE OF EXPIRY") ||
              label.DetectedText?.toUpperCase().includes("EXPIRY DATE") ||
              label.DetectedText?.toUpperCase().includes("DATE D'EXPIRATION")
            ) {
              expiryDate = data.TextDetections![index + 1].DetectedText;
              if (!expiryDate.match(/[0-9]/)) {
                expiryDate = data.TextDetections![index + 2].DetectedText;
              }
            }
          }
        }
      });
      
      if (firstnames && !surname) {
        const names = firstnames.split(" ");
        if (names.length > 1) {
          surname = names[0];
          firstnames = names.slice(1).join(" ");
        } else {
          surname = names[0];
        }
      }
      resolve({
        firstnames: firstnames,
        surname,
        idNumber: idNumber?.replace(/[\s-]/g, ""),
        expiryDate,
      });
    } catch (error) {
      reject(error);
    }
  });
};
