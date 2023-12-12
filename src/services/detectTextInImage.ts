import { client } from "../util/aws.config";
export const detectText = async (
  image: string
): Promise<{ fullname: string; surname: string; idNumber: string }> => {
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
      const extractedText = data.TextDetections?.map((text) =>
        text.Confidence! > 90 ? text.DetectedText : ""
      )
        .filter((t) => t !== "")
        .join("\n");
      var fullname = extractedText
        ?.match(
          /(Names|Noms|Nom|Name|Name\/Nom|Noms\/Names|Names:|Noms:|Nom:|Name:|Name\/Nom:|Noms\/Names:|Names\s|Noms\s|Nom\s|Name\s|Name\/Nom\s|Noms\/Names\s|Names\s:|Noms\s:|Nom\s:|Name\s:|Name\/Nom\s:|Noms\/Names\s:|Names\s\s|Noms\s\s|Nom\s\s|Name\s\s|Name\/Nom\s\s|Noms\/Names\s\s|Names\s\s:|Noms\s\s:|Nom\s\s:|Name\s\s:|Name\/Nom\s\s:|Noms\/Names\s\s:|Names\s\s\s|Noms\s\s\s|Nom\s\s\s|Name\s\s\s|Name\/Nom\s\s\s|Noms\/Names\s\s\s|Names\s\s\s:|Noms\s\s\s:|Nom\s\s\s:|Name\s\s\s:|Name\/Nom\s\s\s:|Noms\/Names\s\s\s:|Names\s\s\s\s|Noms\s\s\s\s|Nom\s\s\s\s|Name\s\s\s\s|Name\/Nom\s\s\s\s|Noms\/Names\s\s\s\s|Names\s\s\s\s:|Noms\s\s\s\s:|Nom\s\s\s\s:|Name\s\s\s\s:|Name\/Nom\s\s\s\s:|Noms\/Names\s\s\s\s:|Names\s\s\s\s\s|Noms\s\s\s\s\s|Nom\s\s\s\s\s|Name\s\s\s\s\s|Name\/Nom\s\s\s\s\s|Noms\/Names\s\s\s\s\s|Names\s\s\s\s\s:|Noms\s\s\s\s\s:|Nom\s\s\s\s\s:|Name\s\s\s\s\s:|Name\/Nom\s\s\s\s\s:|Noms\/Names\s\s\s\s\s:|Names\s\s\s\s\s\s|Noms\s\s\s\s\s\s|Nom\s\s\s\s\s\s|Name\s\s\s\s\s\s|Name\/Nom\s\s\s\s\s\s|Noms\/Names\s\s\s\s\s\s)[^\n]+(\n|$)/
        )![0]
        .replace(
          /(Names|Noms|Nom|Name|Name\/Nom|Noms\/Names|Names:|Noms:|Nom:|Name:|Name\/Nom:|Noms\/Names:|Names\s|Noms\s|Nom\s|Name\s|Name\/Nom\s|Noms\/Names\s|Names\s:|Noms\s:|Nom\s:|Name\s:|Name\/Nom\s:|Noms\/Names\s:|Names\s\s|Noms\s\s|Nom\s\s|Name\s\s|Name\/Nom\s\s|Noms\/Names\s\s|Names\s\s:|Noms\s\s:|Nom\s\s:|Name\s\s:|Name\/Nom\s\s:|Noms\/Names\s\s:|Names\s\s\s|Noms\s\s\s|Nom\s\s\s|Name\s\s\s|Name\/Nom\s\s\s|Noms\/Names\s\s\s|Names\s\s\s:|Noms\s\s\s:|Nom\s\s\s:|Name\s\s\s:|Name\/Nom\s\s\s:|Noms\/Names\s\s\s:|Names\s\s\s\s|Noms\s\s\s\s|Nom\s\s\s\s|Name\s\s\s\s|Name\/Nom\s\s\s\s|Noms\/Names\s\s\s\s|Names\s\s\s\s:|Noms\s\s\s\s:|Nom\s\s\s\s:|Name\s\s\s\s:|Name\/Nom\s\s\s\s:|Noms\/Names\s\s\s\s:|Names\s\s\s\s\s|Noms\s\s\s\s\s|Nom\s\s\s\s\s|Name\s\s\s\s\s|Name\/Nom\s\s\s\s\s|Noms\/Names\s\s\s\s\s|Names\s\s\s\s\s:|Noms\s\s\s\s\s:|Nom\s\s\s\s\s:|Name\s\s\s\s\s:|Name\/Nom\s\s\s\s\s:|Noms\/Names\s\s\s\s\s:|Names\s\s\s\s\s\s|Noms\s\s\s\s\s\s|Nom\s\s\s\s\s\s|Name\s\s\s\s\s\s|Name\/Nom\s\s\s\s\s\s|Noms\/Names\s\s\s\s\s\s):/g,
          ""
        )
        .trim();
      if (!fullname) {
        const surname = extractedText
          ?.match(
            /(Surname|Surnom|Surnom\/Surname|Surnom:|Surname:|Surnom\/Surname:|Surnom\s|Surname\s|Surnom\/Surname\s|Surnom\s:|Surname\s:|Surnom\/Surname\s:|Surnom\s\s|Surname\s\s|Surnom\/Surname\s\s|Surnom\s\s:|Surname\s\s:|Surnom\/Surname\s\s:|Surnom\s\s\s|Surname\s\s\s|Surnom\/Surname\s\s\s|Surnom\s\s\s:|Surname\s\s\s:|Surnom\/Surname\s\s\s:|Surnom\s\s\s\s|Surname\s\s\s\s|Surnom\/Surname\s\s\s\s|Surnom\s\s\s\s:|Surname\s\s\s\s:|Surnom\/Surname\s\s\s\s:|Surnom\s\s\s\s\s|Surname\s\s\s\s\s|Surnom\/Surname\s\s\s\s\s|Surnom\s\s\s\s\s:|Surname\s\s\s\s\s:|Surnom\/Surname\s\s\s\s\s:)/g
          )![0]!
          .replace(
            /(Surname|Surnom|Surnom\/Surname|Surnom:|Surname:|Surnom\/Surname:|Surnom\s|Surname\s|Surnom\/Surname\s|Surnom\s:|Surname\s:|Surnom\/Surname\s:|Surnom\s\s|Surname\s\s|Surnom\/Surname\s\s|Surnom\s\s:|Surname\s\s:|Surnom\/Surname\s\s:|Surnom\s\s\s|Surname\s\s\s|Surnom\/Surname\s\s\s|Surnom\s\s\s:|Surname\s\s\s:|Surnom\/Surname\s\s\s:|Surnom\s\s\s\s|Surname\s\s\s\s|Surnom\/Surname\s\s\s\s|Surnom\s\s\s\s:|Surname\s\s\s\s:|Surnom\/Surname\s\s\s\s:|Surnom\s\s\s\s\s|Surname\s\s\s\s\s|Surnom\/Surname\s\s\s\s\s|Surnom\s\s\s\s\s:|Surname\s\s\s\s\s:|Surnom\/Surname\s\s\s\s\s:)/g,
            ""
          )
          .trim();
        const firstname = extractedText
          ?.match(
            /(Firstname|Prénom|Firstnames|Prénoms|Firstname:|Prénom:|Firstnames:|Prénoms:|Firstname\s|Prénom\s|Firstnames\s|Prénoms\s|Firstname\s:|Prénom\s:|Firstnames\s:|Prénoms\s:|Firstname\s\s|Prénom\s\s|Firstnames\s\s|Prénoms\s\s|Firstname\s\s:|Prénom\s\s:|Firstnames\s\s:|Prénoms\s\s:|Firstname\s\s\s|Prénom\s\s\s|Firstnames\s\s\s|Prénoms\s\s\s|Firstname\s\s\s:|Prénom\s\s\s:|Firstnames\s\s\s:|Prénoms\s\s\s:|Firstname\s\s\s\s|Prénom\s\s\s\s|Firstnames\s\s\s\s|Prénoms\s\s\s\s|Firstname\s\s\s\s:|Prénom\s\s\s\s:|Firstnames\s\s\s\s:|Prénoms\s\s\s\s:|Firstname\s\s\s\s\s|Prénom\s\s\s\s\s|Firstnames\s\s\s\s\s|Prénoms\s\s\s\s\s|Firstname\s\s\s\s\s:|Prénom\s\s\s\s\s:|Firstnames\s\s\s\s\s:|Prénoms\s\s\s\s\s:)/g
          )![0]!
          .replace(
            /(Firstname|Prénom|Firstnames|Prénoms|Firstname:|Prénom:|Firstnames:|Prénoms:|Firstname\s|Prénom\s|Firstnames\s|Prénoms\s|Firstname\s:|Prénom\s:|Firstnames\s:|Prénoms\s:|Firstname\s\s|Prénom\s\s|Firstnames\s\s|Prénoms\s\s|Firstname\s\s:|Prénom\s\s:|Firstnames\s\s:|Prénoms\s\s:|Firstname\s\s\s|Prénom\s\s\s|Firstnames\s\s\s|Prénoms\s\s\s|Firstname\s\s\s:|Prénom\s\s\s:|Firstnames\s\s\s:|Prénoms\s\s\s:|Firstname\s\s\s\s|Prénom\s\s\s\s|Firstnames\s\s\s\s|Prénoms\s\s\s\s|Firstname\s\s\s\s:|Prénom\s\s\s\s:|Firstnames\s\s\s\s:|Prénoms\s\s\s\s:|Firstname\s\s\s\s\s|Prénom\s\s\s\s\s|Firstnames\s\s\s\s\s|Prénoms\s\s\s\s\s|Firstname\s\s\s\s\s:|Prénom\s\s\s\s\s:|Firstnames\s\s\s\s\s:|Prénoms\s\s\s\s\s:)/g,
            ""
          );
        fullname = `${firstname} ${surname}`;
      }
      const idNumber = extractedText?.match(/\d+/g)![0]!;
      const surname = fullname?.split(" ")[0];

      resolve({ fullname, idNumber, surname });
    } catch (error) {
      reject(error);
    }
  });
};
