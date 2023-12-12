"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const aws_config_1 = __importDefault(require("../util/aws.config"));
const axios_1 = __importDefault(require("axios"));
function uploadSingleImage(file, folder, subfolder) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                const filename = `${folder}/${folder === "identities" ? subfolder + "/tenet_identity" : "selfie"}_${Date.now()}.png`;
                const response = yield axios_1.default.get(file, { responseType: "arraybuffer" });
                const buffer = Buffer.from(response.data, "utf-8");
                const uploadedImage = yield aws_config_1.default
                    .upload({
                    Bucket: process.env.AWS_S3_BUCKET_NAME,
                    Key: filename,
                    Body: buffer,
                })
                    .promise();
                resolve(uploadedImage.Location);
            }
            catch (error) {
                reject(error);
            }
        }));
    });
}
exports.default = uploadSingleImage;
