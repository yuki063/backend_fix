"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.detectText = exports.compareFaces = exports.uploadSingleImage = void 0;
const axios_1 = __importDefault(require("axios"));
const aws_config_1 = __importStar(require("../config/aws.config"));
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
exports.uploadSingleImage = uploadSingleImage;
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
const detectText = (image, type) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        var _b;
        try {
            const params = {
                Image: {
                    S3Object: {
                        Bucket: process.env.AWS_S3_BUCKET_NAME,
                        Name: image,
                    },
                },
            };
            const data = yield aws_config_1.client.detectText(params).promise();
            let surname;
            let firstnames;
            let idNumber;
            let expiryDate;
            (_b = data.TextDetections) === null || _b === void 0 ? void 0 : _b.map((label, index) => {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
                if (label.Type === "LINE") {
                    if ((_a = label.DetectedText) === null || _a === void 0 ? void 0 : _a.toUpperCase().includes("SURNAME")) {
                        surname = data.TextDetections[index + 1].DetectedText;
                    }
                    if (((_b = label.DetectedText) === null || _b === void 0 ? void 0 : _b.toUpperCase().includes("LAST NAME")) ||
                        ((_c = label.DetectedText) === null || _c === void 0 ? void 0 : _c.toUpperCase().includes("GIVEN NAMES")) ||
                        ((_d = label.DetectedText) === null || _d === void 0 ? void 0 : _d.toUpperCase().includes("PRÉNOMS")) ||
                        ((_e = label.DetectedText) === null || _e === void 0 ? void 0 : _e.toUpperCase().includes("NAMES"))) {
                        firstnames = data.TextDetections[index + 1].DetectedText;
                    }
                    if ((_f = label.DetectedText) === null || _f === void 0 ? void 0 : _f.toUpperCase().includes("ID NUMBER")) {
                        idNumber = data.TextDetections[index + 1].DetectedText;
                    }
                    if ((_g = label.DetectedText) === null || _g === void 0 ? void 0 : _g.toUpperCase().includes("EXPIRY DATE")) {
                        expiryDate = data.TextDetections[index + 1].DetectedText;
                    }
                    if (((_h = label.DetectedText) === null || _h === void 0 ? void 0 : _h.toUpperCase().includes("IDENTITY NUMBER")) ||
                        ((_j = label.DetectedText) === null || _j === void 0 ? void 0 : _j.toUpperCase().includes("NATIONAL ID NO")) ||
                        ((_k = label.DetectedText) === null || _k === void 0 ? void 0 : _k.toUpperCase().includes("NATIONAL IDENTITY NUMBER")) ||
                        ((_l = label.DetectedText) === null || _l === void 0 ? void 0 : _l.toUpperCase().includes("NATIONAL IDENTITY NO")) ||
                        ((_m = label.DetectedText) === null || _m === void 0 ? void 0 : _m.toUpperCase().includes("IDENTITY NO")) ||
                        ((_o = label.DetectedText) === null || _o === void 0 ? void 0 : _o.toUpperCase().includes("NO D'IDENTITÉ"))) {
                        idNumber = data.TextDetections[index + 1].DetectedText;
                        if (!idNumber.replace(/[\s-]/g, "").match(/[0-9]{8,}/)) {
                            idNumber = data.TextDetections[index + 2].DetectedText;
                        }
                    }
                    if (type !== "NATIONAL_ID") {
                        if (((_p = label.DetectedText) === null || _p === void 0 ? void 0 : _p.toUpperCase().includes("DATE OF EXPIRY")) ||
                            ((_q = label.DetectedText) === null || _q === void 0 ? void 0 : _q.toUpperCase().includes("EXPIRY DATE")) ||
                            ((_r = label.DetectedText) === null || _r === void 0 ? void 0 : _r.toUpperCase().includes("DATE D'EXPIRATION"))) {
                            expiryDate = data.TextDetections[index + 1].DetectedText;
                            if (!expiryDate.match(/[0-9]/)) {
                                expiryDate = data.TextDetections[index + 2].DetectedText;
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
                }
                else {
                    surname = names[0];
                }
            }
            resolve({
                firstnames: firstnames,
                surname,
                idNumber: idNumber === null || idNumber === void 0 ? void 0 : idNumber.replace(/[\s-]/g, ""),
                expiryDate,
            });
        }
        catch (error) {
            reject(error);
        }
    }));
});
exports.detectText = detectText;
