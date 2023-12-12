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
const nodemailer_1 = __importDefault(require("nodemailer"));
function sendEmail(to, subject, text) {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        try {
            var transporter = nodemailer_1.default.createTransport({
                service: 'gmail',
                auth: {
                    user: 'ruka0430petri@gmail.com',
                    pass: 'nnkkclzckscepylm',
                },
            });
            var mailOptions = {
                from: 'ruka0430petri@gmail.com',
                to: to,
                subject: 'Verify Code',
                html: '<html><p>Verification code is ' + text + ' </p></html>',
            };
            let info = yield transporter.sendMail(mailOptions);
            resolve(info);
            // let transporter = nodemailer.createTransport({
            //   host: "smtp.gmail.com",
            //   port: 465,
            //   secure: true,
            //   auth: {
            //     type: "OAuth2",
            //     user: process.env.GMAIL_ADDRESS,
            //     clientId: process.env.GMAIL_OAUTH_CLIENT_ID,
            //     clientSecret: process.env.GMAIL_OAUTH_CLIENT_SECRET,
            //     refreshToken: process.env.GMAIL_OAUTH_REFRESH_TOKEN,
            //     accessToken: process.env.GMAIL_OAUTH_ACCESS_TOKEN,
            //     expires: Number.parseInt(process.env.GMAIL_OAUTH_TOKEN_EXPIRE!, 10),
            //   },
            // });
            // let mailOptions = {
            //   from: process.env.EMAIL,
            //   to: to,
            //   subject: subject,
            //   text: text,
            // };
            // let info = await transporter.sendMail(mailOptions);
            // resolve(info);
        }
        catch (error) {
            reject(error);
        }
    }));
}
exports.default = sendEmail;
