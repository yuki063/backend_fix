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
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareFaces = void 0;
const aws_config_1 = require("../util/aws.config");
const compareFaces = (photo_source, photo_target) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
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
            const data = yield aws_config_1.client.compareFaces(params).promise();
            const n = (_a = data.FaceMatches) === null || _a === void 0 ? void 0 : _a.map((data) => {
                let similarity = data.Similarity;
                return similarity;
            });
            resolve(n[0] > 90);
        }
        catch (error) {
            reject(error);
        }
    }));
});
exports.compareFaces = compareFaces;
