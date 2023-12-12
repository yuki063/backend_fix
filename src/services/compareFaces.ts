import { client } from "../util/aws.config";

export const compareFaces = async (
  photo_source: string,
  photo_target: string
) : Promise<boolean> => {
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
