"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const s3 = new aws_sdk_1.default.S3({
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
});
aws_sdk_1.default.config.update({
    region: "us-east-1",
    accessKeyId: "AKIA37OUYA7CPUPLAFKL",
    secretAccessKey: "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",
});
const client = new aws_sdk_1.default.Rekognition();
exports.client = client;
exports.default = s3;
