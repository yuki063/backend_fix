"use strict";
/** @format */
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
exports.uploadPersonalInformation = exports.deactivateUser = exports.activateUser = exports.newPassword = exports.resetPassword = exports.verifyWithOTP = exports.createUserWithPassword = exports.registerEmail = exports.uploadSelfie = exports.analyzeUserDocuments = exports.getUserHome = exports.getUserData = exports.uploadIdentity = exports.resendCode = exports.login = exports.registerPhoneNumber = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const user_model_1 = __importDefault(require("../models/user.model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const api_response_1 = require("../util/api.response");
const validation_1 = require("../util/validation");
const aws_1 = require("../util/aws");
const aws_2 = require("../util/aws");
const extractimageName_1 = require("../util/extractimageName");
const otpService_1 = require("../util/otpService");
const sms_1 = require("../util/sms");
const email_1 = __importDefault(require("../util/email"));
const axios_1 = __importDefault(require("axios"));
const registerPhoneNumber = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { phoneNumber, getNotifications } = req.body;
        if (!phoneNumber) {
            return (0, api_response_1.errorResponse)('Phone number is required', res);
        }
        const user = yield user_model_1.default.findOne({ phoneNumber }, { phoneNumber: 1 });
        if (user) {
            return (0, api_response_1.errorResponse)('Phone number already exists', res);
        }
        let { hash, otp } = (0, otpService_1.createNewOTP)(phoneNumber);
        console.log(hash, otp);
        let sms = (0, sms_1.registerSMS)(otp);
        yield (0, sms_1.sendSMS)(phoneNumber, sms);
        return (0, api_response_1.successResponse)('Phone number registered successfully', { hash }, res);
    }
    catch (error) {
        return (0, api_response_1.serverErrorResponse)(error, res);
    }
});
exports.registerPhoneNumber = registerPhoneNumber;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { phoneNumber, password, email } = req.body;
        var user;
        if (email) {
            user = yield user_model_1.default.findOne({
                email,
            }, {
                status: 0,
                expiryDate: 0,
            });
        }
        else if (phoneNumber) {
            user = yield user_model_1.default.findOne({ phoneNumber }, {
                status: 0,
                expiryDate: 0,
            });
        }
        else {
            return (0, api_response_1.errorResponse)('Phone number or email is required', res);
        }
        if (!user) {
            if (email) {
                return (0, api_response_1.errorResponse)('Invalid email or password', res);
            }
            else if (phoneNumber) {
                return (0, api_response_1.errorResponse)('Invalid phone number or password', res);
            }
        }
        const isPasswordValid = user.comparePassword(password);
        if (!isPasswordValid) {
            if (email) {
                return (0, api_response_1.errorResponse)('Invalid email or password', res);
            }
            return (0, api_response_1.errorResponse)('Invalid phone number or  password', res);
        }
        console.log(isPasswordValid);
        const token = user.generateAuthToken();
        return (0, api_response_1.successResponse)('Login successful', { token }, res);
    }
    catch (error) {
        console.log(error);
        return (0, api_response_1.serverErrorResponse)(error, res);
    }
});
exports.login = login;
const resendCode = (req, res, type) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { phoneNumber, email } = req.body;
        if (!phoneNumber && !email) {
            return (0, api_response_1.errorResponse)('Phone number or email are required', res);
        }
        if (phoneNumber) {
            let { hash, otp } = (0, otpService_1.createNewOTP)(phoneNumber);
            let sms;
            if (type === 'signup') {
                sms = (0, sms_1.registerSMS)(otp);
            }
            else if (type === 'reset') {
                sms = (0, sms_1.resetSMS)(otp);
            }
            else {
                return (0, api_response_1.errorResponse)('Something went wrong', res);
            }
            yield (0, sms_1.sendSMS)(phoneNumber, sms);
            return (0, api_response_1.successResponse)('Code resent successfully', { hash }, res);
        }
        else if (email) {
            let { hash, otp } = (0, otpService_1.createNewOTP)(email);
            yield (0, email_1.default)(email, type === 'signup' ? 'Verification' : 'Reset password', 'Your code is ' + otp + '\nhurry up the codes expires in 5 minutes');
            return (0, api_response_1.successResponse)('Code resent successfully', { hash }, res);
        }
    }
    catch (error) {
        return (0, api_response_1.serverErrorResponse)(error, res);
    }
});
exports.resendCode = resendCode;
const uploadIdentity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { type } = req.query;
        if (![
            'LOCAL_PASSPORT',
            'NATIONAL_ID',
            'DRIVERS_LICENSE',
            'ASYLUM_DOCUMENT',
            'FOREIGN_PASSPORT',
        ].includes(type)) {
            return (0, api_response_1.errorResponse)('Invalid identity type', res);
        }
        if (!req.body.identity) {
            return (0, api_response_1.errorResponse)('Identity is required', res);
        }
        // const link = await uploadImage(req.body.identity, "identities", type);
        const data = yield axios_1.default.post(`${process.env.APZ_KYC_LINK}/v1/customers/upload-identity-card`, {
            identity: req.body.identity,
            type,
        }, {
            headers: {
                'x-api-key': process.env.APZ_KYC_APIKEY,
            },
        });
        const { customerId, link } = data.data.data;
        yield user_model_1.default.findByIdAndUpdate(req.user._id, {
            identity: {
                identityType: type,
                picture: link,
            },
            completedSteps: 4,
            kycId: customerId,
        }, {
            new: true,
        });
        return (0, api_response_1.successResponse)('Identity uploaded uploaded successfully', null, res);
    }
    catch (error) {
        console.log(error);
        return (0, api_response_1.serverErrorResponse)(error, res);
    }
});
exports.uploadIdentity = uploadIdentity;
const getUserData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.default.findById(req.user._id, {
            password: 0,
            __v: 0,
            status: 0,
            expiryDate: 0,
            _id: 0,
            role: 0,
            getNotifications: 0,
            createdAt: 0,
            updatedAt: 0,
        });
        return (0, api_response_1.successResponse)('User data retrieved successfully', user, res);
    }
    catch (error) {
        return (0, api_response_1.serverErrorResponse)(error, res);
    }
});
exports.getUserData = getUserData;
const getUserHome = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = (yield user_model_1.default.findById(req.user._id));
        if (!user)
            return (0, api_response_1.errorResponse)("User doesn't exist", res);
        return (0, api_response_1.successResponse)('User retrieved successfully', user, res);
    }
    catch (error) {
        return (0, api_response_1.serverErrorResponse)(error, res);
    }
});
exports.getUserHome = getUserHome;
const analyzeUserDocuments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const user = yield user_model_1.default.findById(req.user._id, {
            role: 0,
            status: 0,
            phoneNumber: 0,
            getNotifications: 0,
            email: 0,
            gender: 0,
            createdAt: 0,
            updatedAt: 0,
        });
        let errors = [];
        if (!(user === null || user === void 0 ? void 0 : user.identity) ||
            !(user === null || user === void 0 ? void 0 : user.identity.picture) ||
            !(user === null || user === void 0 ? void 0 : user.identity.identityType)) {
            errors.push('NO_IDENTITY');
            errors.push('FACE_MISMATCH');
            errors.push('PERSONAL_INFO_MISMATCH');
        }
        if (!(user === null || user === void 0 ? void 0 : user.selfie)) {
            errors.push('NO_SELFIE');
            errors.push('FACE_MISMATCH');
        }
        let identityImageUrl, selfieUrl;
        if (!errors.includes('NO_IDENTITY')) {
            identityImageUrl = (0, extractimageName_1.extracImageName)(user === null || user === void 0 ? void 0 : user.identity.picture);
        }
        if (!errors.includes('NO_SELFIE')) {
            selfieUrl = (0, extractimageName_1.extracImageName)(user === null || user === void 0 ? void 0 : user.selfie);
        }
        let faceMatch;
        if (errors.length === 0) {
            faceMatch = yield (0, aws_2.compareFaces)(selfieUrl, identityImageUrl);
        }
        if (!errors.includes('NO_IDENTITY')) {
            const { firstnames, surname, idNumber, expiryDate } = yield (0, aws_1.detectText)(identityImageUrl, (_a = user === null || user === void 0 ? void 0 : user.identity) === null || _a === void 0 ? void 0 : _a.identityType);
            let givenDate = new Date(user === null || user === void 0 ? void 0 : user.expiryDate);
            let detectedDate = new Date(expiryDate);
            detectedDate.setDate(detectedDate.getDate() + 1);
            if (!surname || !firstnames || !idNumber || !expiryDate) {
                errors.push('NO_IDENTITY');
                if (!errors.includes('FACE_MISMATCH')) {
                    errors.push('FACE_MISMATCH');
                }
            }
            if (!errors.includes('FACE_MISMATCH')) {
                if (!faceMatch) {
                    errors.push('FACE_MISMATCH');
                }
            }
            if (!errors.includes('NO_IDENTITY')) {
                if (surname.toUpperCase() !== (user === null || user === void 0 ? void 0 : user.surname.toUpperCase())) {
                    errors.push('SURNAME_MISMATCH');
                }
                if (firstnames.toUpperCase() !== (user === null || user === void 0 ? void 0 : user.firstnames.toUpperCase())) {
                    errors.push('FIRSTNAMES_MISMATCH');
                }
                if (idNumber !== (user === null || user === void 0 ? void 0 : user.identityNumber)) {
                    errors.push('ID_MISMATCH');
                }
                if ((user === null || user === void 0 ? void 0 : user.identity.identityType) !== 'NATIONAL_ID') {
                    if (givenDate.getMonth() !== detectedDate.getMonth() &&
                        givenDate.getFullYear() !== detectedDate.getFullYear() &&
                        givenDate.getDate() !== detectedDate.getDate()) {
                        errors.push('EXPIRY_DATE_MISMATCH');
                    }
                }
            }
        }
        if (errors.length > 0) {
            if (errors.includes('NO_IDENTITY') || errors.includes('FACE_MISMATCH')) {
                yield user_model_1.default.findByIdAndUpdate(req.user._id, {
                    completedSteps: 3,
                }, {
                    new: true,
                });
            }
            else if (errors.includes('FACE_MISMATCH') ||
                errors.includes('NO_SELFIE')) {
                yield user_model_1.default.findByIdAndUpdate(req.user._id, {
                    completedSteps: 4,
                }, {
                    new: true,
                });
            }
            else {
                yield user_model_1.default.findByIdAndUpdate(req.user._id, {
                    completedSteps: 5,
                }, {
                    new: true,
                });
            }
            return (0, api_response_1.errorResponse)('Documents mismatch', res, {
                errors,
            });
        }
        yield user_model_1.default.findByIdAndUpdate(req.user._id, {
            completedSteps: 7,
        }, {
            new: true,
        });
        return (0, api_response_1.successResponse)('Documents match', null, res);
    }
    catch (error) {
        return (0, api_response_1.serverErrorResponse)(error, res);
    }
});
exports.analyzeUserDocuments = analyzeUserDocuments;
const uploadSelfie = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let user1 = yield user_model_1.default.findById(req.user._id, { _id: 1 });
        if (!user1) {
            return (0, api_response_1.errorResponse)('User not found', res);
        }
        const data = yield axios_1.default.post(`${process.env.APZ_KYC_LINK}/v1/customers/upload-selfie?customeriId=${user1 === null || user1 === void 0 ? void 0 : user1._id}`, {
            selfie: req.body.selfie,
        }, {
            headers: {
                'x-api-key': process.env.APZ_KYC_APIKEY,
            },
        });
        const { customerId, link } = data.data.data;
        let user = yield user_model_1.default.findByIdAndUpdate(req.user._id, {
            selfie: link,
            completedSteps: 5,
        }, { new: true });
        return (0, api_response_1.successResponse)('Selfie uploaded successfully', null, res);
    }
    catch (error) {
        console.log(error);
        return (0, api_response_1.serverErrorResponse)(error, res);
    }
});
exports.uploadSelfie = uploadSelfie;
const registerEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        if (!email) {
            return (0, api_response_1.errorResponse)('Provide your email please!', res);
        }
        if (!/[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}/gim.test(email)) {
            return (0, api_response_1.errorResponse)('Enter valid email', res);
        }
        const exists = yield user_model_1.default.findOne({ email });
        if (exists) {
            return (0, api_response_1.errorResponse)('Email alreay exists', res);
        }
        const { otp, hash } = (0, otpService_1.createNewOTP)(email);
        console.log(otp);
        const text = `your code is ${otp}\nhurry up the code expires in 5 minutes`;
        yield (0, email_1.default)(email, 'Authentiation', text);
        return (0, api_response_1.successResponse)('We have sent email to your email address check it for your code', { hash }, res);
    }
    catch (error) {
        return (0, api_response_1.serverErrorResponse)(error, res);
    }
});
exports.registerEmail = registerEmail;
const createUserWithPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { password, ticket } = req.body;
        const { error } = validation_1.newPasswordSchema.validate({ password });
        if (error) {
            return (0, api_response_1.errorResponse)(error.details[0].message, res);
        }
        const decoded = (0, jsonwebtoken_1.verify)(ticket, process.env.JWT_KEY);
        if (!decoded) {
            return (0, api_response_1.errorResponse)('Invalid ticket', res);
        }
        const userpassword = yield bcrypt_1.default.hash(password, 10);
        var user;
        if (decoded.email) {
            user = new user_model_1.default({
                password: userpassword,
                email: decoded.email,
            });
        }
        else {
            user = new user_model_1.default({
                password: userpassword,
                phoneNumber: decoded.phoneNumber,
            });
        }
        let token = user.generateAuthToken();
        yield user.save();
        return (0, api_response_1.successResponse)('User created successfully', { token }, res);
    }
    catch (error) {
        return (0, api_response_1.serverErrorResponse)(error, res);
    }
});
exports.createUserWithPassword = createUserWithPassword;
const verifyWithOTP = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { phoneNumber, code, hash, email } = req.body;
    try {
        if (!code || !hash) {
            if (email.length === 0) {
                return (0, api_response_1.errorResponse)('Invalid email or OTP', res);
            }
            else if (phoneNumber.length === 0) {
                return (0, api_response_1.errorResponse)('Invalid phone number or OTP', res);
            }
        }
        let verified;
        if (email.length > 0)
            verified = yield (0, otpService_1.verifyOTP)(email, code, hash);
        else
            verified = yield (0, otpService_1.verifyOTP)(phoneNumber, code, hash);
        if (!verified) {
            if (email)
                return (0, api_response_1.errorResponse)('Invalid email or OTP', res);
            return (0, api_response_1.errorResponse)('Invalid phone number or OTP', res);
        }
        let key = process.env.JWT_KEY;
        let ticket = (0, jsonwebtoken_1.sign)(email ? { email } : { phoneNumber }, key, {
            expiresIn: '5m',
        });
        return (0, api_response_1.successResponse)(email.length > 0 ? 'email' : 'Phone number' + ' verified successfully', { ticket }, res);
    }
    catch (error) {
        return (0, api_response_1.errorResponse)('The OTP you gave us has expired or is invalid, request another one please', res);
    }
});
exports.verifyWithOTP = verifyWithOTP;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { phoneNumber, email } = req.body;
        var user;
        if (email) {
            user = yield user_model_1.default.findOne({ email }, { email: 1 });
        }
        else if (phoneNumber) {
            user = yield user_model_1.default.findOne({ phoneNumber }, { phoneNumber: 1 });
        }
        else {
            return (0, api_response_1.errorResponse)('Invalid input', res);
        }
        if (!user) {
            return (0, api_response_1.errorResponse)('Invalid phone number', res);
        }
        if (email) {
            let { hash, otp } = (0, otpService_1.createNewOTP)(email);
            yield (0, email_1.default)(email, 'Reset Password', 'Your code is ' + otp + '\nhurry up the code expires in 5 minutes');
            return (0, api_response_1.successResponse)('Request to reset phone number was received successfully', { hash }, res);
        }
        else {
            let { hash, otp } = (0, otpService_1.createNewOTP)(phoneNumber);
            let resetPaswordText = (0, sms_1.resetSMS)(otp);
            let sent = yield (0, sms_1.sendSMS)(phoneNumber, resetPaswordText);
            if (!sent) {
                return (0, api_response_1.serverErrorResponse)('Something went wrong while sending message to your phone number', res);
            }
            return (0, api_response_1.successResponse)('Request to reset phone number was received successfully', { hash }, res);
        }
    }
    catch (error) {
        return (0, api_response_1.serverErrorResponse)(error, res);
    }
});
exports.resetPassword = resetPassword;
const newPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { newPassword, ticket } = req.body;
        const { error } = validation_1.newPasswordSchema.validate({ password: newPassword });
        if (error) {
            return (0, api_response_1.errorResponse)(error.details[0].message, res);
        }
        const decoded = (0, jsonwebtoken_1.verify)(ticket, process.env.JWT_KEY);
        if (!decoded) {
            return (0, api_response_1.errorResponse)('Invalid ticket', res);
        }
        const password = yield bcrypt_1.default.hash(newPassword, 10);
        if (decoded.email) {
            yield user_model_1.default.findOneAndUpdate({ email: decoded.email }, {
                password,
            });
        }
        else {
            yield user_model_1.default.findOneAndUpdate({ phoneNumber: decoded.phoneNumber }, {
                password,
            });
        }
        return (0, api_response_1.successResponse)('Password changed successfully', null, res);
    }
    catch (error) {
        return (0, api_response_1.serverErrorResponse)(error, res);
    }
});
exports.newPassword = newPassword;
const activateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let user = yield user_model_1.default.findByIdAndUpdate(req.body.id, {
            status: 'ACTIVATED',
        });
        return (0, api_response_1.successResponse)('User activated successfully', user, res);
    }
    catch (error) {
        return (0, api_response_1.serverErrorResponse)(error, res);
    }
});
exports.activateUser = activateUser;
const deactivateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let user = yield user_model_1.default.findByIdAndUpdate(req.body.id, {
            status: 'DEACTIVATED',
        });
        return (0, api_response_1.successResponse)('User deactivated successfully', user, res);
    }
    catch (error) {
        return (0, api_response_1.serverErrorResponse)(error, res);
    }
});
exports.deactivateUser = deactivateUser;
const uploadPersonalInformation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstnames, surname, identityNumber, expiryDate } = req.body;
        axios_1.default
            .post(`${process.env.APZ_KYC_LINK}/v1/customers/upload-personal-info`, {}, {
            headers: {
                'x-api-key': process.env.APZ_KYC_APIKEY,
            },
        })
            .then((data) => __awaiter(void 0, void 0, void 0, function* () {
            yield user_model_1.default.findByIdAndUpdate(req.user._id, {
                firstnames,
                surname,
                identityNumber,
                expiryDate,
                completedSteps: 6,
            }, { new: true });
            return (0, api_response_1.successResponse)('Personal information uploaded successfully', null, res);
        }))
            .catch((err) => {
            if (err.status === 401) {
                return;
            }
        });
    }
    catch (error) {
        return (0, api_response_1.serverErrorResponse)(error, res);
    }
});
exports.uploadPersonalInformation = uploadPersonalInformation;
