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
exports.sendSMS = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const sendSMS = (phoneNumber, message) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        var params = {
            Message: message /* required */,
            PhoneNumber: phoneNumber,
        };
        try {
            var publishTextPromise = new aws_sdk_1.default.SNS({ apiVersion: "2010-03-31" })
                .publish(params)
                .promise();
            const data = yield publishTextPromise;
            resolve(data);
        }
        catch (error) {
            reject(error);
        }
    }));
});
exports.sendSMS = sendSMS;
