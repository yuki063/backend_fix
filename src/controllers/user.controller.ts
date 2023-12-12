/** @format */

import { Request, Response } from 'express';
import { verify, sign } from 'jsonwebtoken';
import User from '../models/user.model';
import bcrypt from 'bcrypt';
import {
	errorResponse,
	serverErrorResponse,
	successResponse,
} from '../util/api.response';

import { newPasswordSchema } from '../util/validation';
import { uploadSingleImage as uploadImage } from '../util/aws';
import { detectText } from '../util/aws';
import { compareFaces } from '../util/aws';
import { extracImageName } from '../util/extractimageName';
import { createNewOTP, verifyOTP } from '../util/otpService';
import { registerSMS, resetSMS, sendSMS } from '../util/sms';
import sendEmail from '../util/email';
import { IUser } from '../types/user';
import axios from 'axios';

export const registerPhoneNumber = async (req: Request, res: Response) => {
	try {
		const { phoneNumber, getNotifications } = req.body;
		if (!phoneNumber) {
			return errorResponse('Phone number is required', res);
		}
		const user = await User.findOne({ phoneNumber }, { phoneNumber: 1 });
		if (user) {
			return errorResponse('Phone number already exists', res);
		}

		let { hash, otp } = createNewOTP(phoneNumber);
		let sms = registerSMS(otp);
		await sendSMS(phoneNumber, sms);
		return successResponse(
			'Phone number registered successfully',
			{ hash },
			res
		);
	} catch (error) {
		return serverErrorResponse(error, res);
	}
};
export const login = async (req: Request, res: Response) => {
	try {
		const { phoneNumber, password, email } = req.body;

		var user;
		if (email) {
			user = await User.findOne(
				{
					email,
				},
				{
					status: 0,
					expiryDate: 0,
				}
			);
		} else if (phoneNumber) {
			user = await User.findOne(
				{ phoneNumber },
				{
					status: 0,
					expiryDate: 0,
				}
			);
		} else {
			return errorResponse('Phone number or email is required', res);
		}
		if (!user) {
			if (email) {
				return errorResponse('Invalid email or password', res);
			} else if (phoneNumber) {
				return errorResponse('Invalid phone number or password', res);
			}
		}
		const isPasswordValid = user.comparePassword(password);
		if (!isPasswordValid) {
			if (email) {
				return errorResponse('Invalid email or password', res);
			}
			return errorResponse('Invalid phone number or  password', res);
		}
		console.log(isPasswordValid);
		const token = user.generateAuthToken();

		return successResponse('Login successful', { token }, res);
	} catch (error) {
		console.log(error);
		return serverErrorResponse(error, res);
	}
};

export const resendCode = async (
	req: Request,
	res: Response,
	type: 'signup' | 'reset'
) => {
	try {
		const { phoneNumber, email } = req.body;
		if (!phoneNumber && !email) {
			return errorResponse('Phone number or email are required', res);
		}
		if (phoneNumber) {
			let { hash, otp } = createNewOTP(phoneNumber);
			let sms;
			if (type === 'signup') {
				sms = registerSMS(otp);
			} else if (type === 'reset') {
				sms = resetSMS(otp);
			} else {
				return errorResponse('Something went wrong', res);
			}
			await sendSMS(phoneNumber, sms);
			return successResponse('Code resent successfully', { hash }, res);
		} else if (email) {
			let { hash, otp } = createNewOTP(email);
			await sendEmail(
				email,
				type === 'signup' ? 'Verification' : 'Reset password',
				'Your code is ' + otp + '\nhurry up the codes expires in 5 minutes'
			);
			return successResponse('Code resent successfully', { hash }, res);
		}
	} catch (error) {
		return serverErrorResponse(error, res);
	}
};

export const uploadIdentity = async (req: any, res: Response) => {
	try {
		const { type } = req.query;
		if (
			![
				'LOCAL_PASSPORT',
				'NATIONAL_ID',
				'DRIVERS_LICENSE',
				'ASYLUM_DOCUMENT',
				'FOREIGN_PASSPORT',
			].includes(type as string)
		) {
			return errorResponse('Invalid identity type', res);
		}
		if (!req.body.identity) {
			return errorResponse('Identity is required', res);
		}
		// const link = await uploadImage(req.body.identity, "identities", type);
		const data = await axios.post(
			`${process.env.APZ_KYC_LINK}/v1/customers/upload-identity-card`,
			{
				identity: req.body.identity,
				type,
			},
			{
				headers: {
					'x-api-key': process.env.APZ_KYC_APIKEY,
				},
			}
		);
		const { customerId, link } = data.data.data;

		await User.findByIdAndUpdate(
			req.user._id,
			{
				identity: {
					identityType: type as string,
					picture: link,
				},
				completedSteps: 4,
				kycId: customerId,
			},
			{
				new: true,
			}
		);
		return successResponse(
			'Identity uploaded uploaded successfully',
			null,
			res
		);
	} catch (error) {
		console.log(error);
		return serverErrorResponse(error, res);
	}
};

export const getUserData = async (req: any, res: Response) => {
	try {
		const user = await User.findById(req.user._id, {
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
		return successResponse('User data retrieved successfully', user, res);
	} catch (error) {
		return serverErrorResponse(error, res);
	}
};

export const getUserHome = async (req: any, res: Response) => {
	try {
		const user = (await User.findById(req.user._id)) as any;
		if (!user) return errorResponse("User doesn't exist", res);
		return successResponse('User retrieved successfully', user, res);
	} catch (error) {
		return serverErrorResponse(error, res);
	}
};

export const analyzeUserDocuments = async (req: any, res: Response) => {
	try {
		const user = await User.findById(req.user._id, {
			role: 0,
			status: 0,
			phoneNumber: 0,
			getNotifications: 0,
			email: 0,
			gender: 0,
			createdAt: 0,
			updatedAt: 0,
		});
		let errors: string[] = [];
		if (
			!user?.identity ||
			!user?.identity.picture ||
			!user?.identity.identityType
		) {
			errors.push('NO_IDENTITY');
			errors.push('FACE_MISMATCH');
			errors.push('PERSONAL_INFO_MISMATCH');
		}
		if (!user?.selfie) {
			errors.push('NO_SELFIE');
			errors.push('FACE_MISMATCH');
		}
		let identityImageUrl, selfieUrl;
		if (!errors.includes('NO_IDENTITY')) {
			identityImageUrl = extracImageName(user?.identity!.picture!);
		}
		if (!errors.includes('NO_SELFIE')) {
			selfieUrl = extracImageName(user?.selfie!);
		}
		let faceMatch;
		if (errors.length === 0) {
			faceMatch = await compareFaces(selfieUrl, identityImageUrl);
		}
		if (!errors.includes('NO_IDENTITY')) {
			const { firstnames, surname, idNumber, expiryDate } = await detectText(
				identityImageUrl,
				user?.identity?.identityType! as
					| 'LOCAL_PASSPORT'
					| 'NATIONAL_ID'
					| 'DRIVERS_LICENSE'
					| 'ASYLUM_DOCUMENT'
					| 'FOREIGN_PASSPORT'
			);
			let givenDate = new Date(user?.expiryDate!);
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
				if (surname.toUpperCase() !== user?.surname.toUpperCase()) {
					errors.push('SURNAME_MISMATCH');
				}
				if (firstnames.toUpperCase() !== user?.firstnames.toUpperCase()) {
					errors.push('FIRSTNAMES_MISMATCH');
				}
				if (idNumber !== user?.identityNumber) {
					errors.push('ID_MISMATCH');
				}
				if (user?.identity.identityType !== 'NATIONAL_ID') {
					if (
						givenDate.getMonth() !== detectedDate.getMonth() &&
						givenDate.getFullYear() !== detectedDate.getFullYear() &&
						givenDate.getDate() !== detectedDate.getDate()
					) {
						errors.push('EXPIRY_DATE_MISMATCH');
					}
				}
			}
		}
		if (errors.length > 0) {
			if (errors.includes('NO_IDENTITY') || errors.includes('FACE_MISMATCH')) {
				await User.findByIdAndUpdate(
					req.user._id,
					{
						completedSteps: 3,
					},
					{
						new: true,
					}
				);
			} else if (
				errors.includes('FACE_MISMATCH') ||
				errors.includes('NO_SELFIE')
			) {
				await User.findByIdAndUpdate(
					req.user._id,
					{
						completedSteps: 4,
					},
					{
						new: true,
					}
				);
			} else {
				await User.findByIdAndUpdate(
					req.user._id,
					{
						completedSteps: 5,
					},
					{
						new: true,
					}
				);
			}
			return errorResponse('Documents mismatch', res, {
				errors,
			});
		}
		await User.findByIdAndUpdate(
			req.user._id,
			{
				completedSteps: 7,
			},
			{
				new: true,
			}
		);
		return successResponse('Documents match', null, res);
	} catch (error) {
		return serverErrorResponse(error, res);
	}
};

export const uploadSelfie = async (req: any, res: Response) => {
	try {
		let user1 = await User.findById(req.user._id, { _id: 1 });
		if (!user1) {
			return errorResponse('User not found', res);
		}
		const data = await axios.post(
			`${process.env.APZ_KYC_LINK}/v1/customers/upload-selfie?customeriId=${user1?._id}`,
			{
				selfie: req.body.selfie,
			},
			{
				headers: {
					'x-api-key': process.env.APZ_KYC_APIKEY,
				},
			}
		);
		const { customerId, link } = data.data.data;
		let user = await User.findByIdAndUpdate(
			req.user._id,
			{
				selfie: link,
				completedSteps: 5,
			},
			{ new: true }
		);

		return successResponse('Selfie uploaded successfully', null, res);
	} catch (error) {
		console.log(error);
		return serverErrorResponse(error, res);
	}
};

export const registerEmail = async (req: any, res: Response) => {
	
	try {
		const { email } = req.body;
		if (!email) {
			return errorResponse('Provide your email please!', res);
		}
		if (!/[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}/gim.test(email)) {
			return errorResponse('Enter valid email', res);
		}
		const exists = await User.findOne({ email });
		if (exists) {
			return errorResponse('Email alreay exists', res);
		}
		const { otp, hash } = createNewOTP(email);
		console.log(otp);
		const text = `your code is ${otp}\nhurry up the code expires in 5 minutes`;
		await sendEmail(email, 'Authentiation', text);
		return successResponse(
			'We have sent email to your email address check it for your code',
			{ hash },
			res
		);
	} catch (error) {
		return serverErrorResponse(error, res);
	}
};

export const createUserWithPassword = async (req: Request, res: Response) => {
	try {
		const { password, ticket } = req.body;
		const { error } = newPasswordSchema.validate({ password });
		if (error) {
			return errorResponse(error.details[0].message, res);
		}
		const decoded: any = verify(ticket, process.env.JWT_KEY!);
		if (!decoded) {
			return errorResponse('Invalid ticket', res);
		}
		const userpassword = await bcrypt.hash(password, 10);
		var user: IUser;
		if (decoded.email) {
			user = new User({
				password: userpassword,
				email: decoded.email,
			});
		} else {
			user = new User({
				password: userpassword,
				phoneNumber: decoded.phoneNumber,
			});
		}
		let token = user.generateAuthToken();
		await user.save();
		return successResponse('User created successfully', { token }, res);
	} catch (error) {
		return serverErrorResponse(error, res);
	}
};

export const verifyWithOTP = async (req: Request, res: Response) => {
	const { phoneNumber, code, hash, email } = req.body;
	try {
		if (!code || !hash) {
			if (email.length === 0) {
				return errorResponse('Invalid email or OTP', res);
			} else if (phoneNumber.length === 0) {
				return errorResponse('Invalid phone number or OTP', res);
			}
		}
		let verified;
		if (email.length > 0) verified = await verifyOTP(email, code, hash);
		else verified = await verifyOTP(phoneNumber, code, hash);

		if (!verified) {
			if (email) return errorResponse('Invalid email or OTP', res);
			return errorResponse('Invalid phone number or OTP', res);
		}
		let key: string = process.env.JWT_KEY!;
		let ticket = sign(email ? { email } : { phoneNumber }, key, {
			expiresIn: '5m',
		});

		return successResponse(
			email.length > 0 ? 'email' : 'Phone number' + ' verified successfully',
			{ ticket },
			res
		);
	} catch (error) {
		return errorResponse(
			'The OTP you gave us has expired or is invalid, request another one please',
			res
		);
	}
};

export const resetPassword = async (req: Request, res: Response) => {
	try {
		const { phoneNumber, email } = req.body;
		var user;
		if (email) {
			user = await User.findOne({ email }, { email: 1 });
		} else if (phoneNumber) {
			user = await User.findOne({ phoneNumber }, { phoneNumber: 1 });
		} else {
			return errorResponse('Invalid input', res);
		}
		if (!user) {
			return errorResponse('Invalid phone number', res);
		}
		if (email) {
			let { hash, otp } = createNewOTP(email);
			await sendEmail(
				email,
				'Reset Password',
				'Your code is ' + otp + '\nhurry up the code expires in 5 minutes'
			);
			return successResponse(
				'Request to reset phone number was received successfully',
				{ hash },
				res
			);
		} else {
			let { hash, otp } = createNewOTP(phoneNumber);
			let resetPaswordText = resetSMS(otp);
			let sent = await sendSMS(phoneNumber, resetPaswordText);
			if (!sent) {
				return serverErrorResponse(
					'Something went wrong while sending message to your phone number',
					res
				);
			}
			return successResponse(
				'Request to reset phone number was received successfully',
				{ hash },
				res
			);
		}
	} catch (error) {
		return serverErrorResponse(error, res);
	}
};

export const newPassword = async (req: Request, res: Response) => {
	try {
		const { newPassword, ticket } = req.body;
		const { error } = newPasswordSchema.validate({ password: newPassword });
		if (error) {
			return errorResponse(error.details[0].message, res);
		}
		const decoded: any = verify(ticket, process.env.JWT_KEY!);
		if (!decoded) {
			return errorResponse('Invalid ticket', res);
		}
		const password = await bcrypt.hash(newPassword, 10);
		if (decoded.email) {
			await User.findOneAndUpdate(
				{ email: decoded.email },
				{
					password,
				}
			);
		} else {
			await User.findOneAndUpdate(
				{ phoneNumber: decoded.phoneNumber },
				{
					password,
				}
			);
		}
		return successResponse('Password changed successfully', null, res);
	} catch (error) {
		return serverErrorResponse(error, res);
	}
};

export const activateUser = async (req: Request, res: Response) => {
	try {
		let user = await User.findByIdAndUpdate(req.body.id, {
			status: 'ACTIVATED',
		});
		return successResponse('User activated successfully', user, res);
	} catch (error) {
		return serverErrorResponse(error, res);
	}
};

export const deactivateUser = async (req: Request, res: Response) => {
	try {
		let user = await User.findByIdAndUpdate(req.body.id, {
			status: 'DEACTIVATED',
		});
		return successResponse('User deactivated successfully', user, res);
	} catch (error) {
		return serverErrorResponse(error, res);
	}
};

export const uploadPersonalInformation = async (req: any, res: Response) => {
	try {
		const { firstnames, surname, identityNumber, expiryDate } = req.body;
		axios
			.post(
				`${process.env.APZ_KYC_LINK}/v1/customers/upload-personal-info`,
				{},
				{
					headers: {
						'x-api-key': process.env.APZ_KYC_APIKEY,
					},
				}
			)
			.then(async (data) => {
				await User.findByIdAndUpdate(
					(req as any).user._id,
					{
						firstnames,
						surname,
						identityNumber,
						expiryDate,
						completedSteps: 6,
					},
					{ new: true }
				);
				return successResponse(
					'Personal information uploaded successfully',
					null,
					res
				);
			})
			.catch((err) => {
				if (err.status === 401) {
					return;
				}
			});
	} catch (error) {
		return serverErrorResponse(error, res);
	}
};
