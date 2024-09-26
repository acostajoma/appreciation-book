import { z } from 'zod';
import {
	invalid_type_error,
	min_length_error,
	required_error,
	mismatching_passwords_error,
	invalid_format,
	exactly_length_error,
} from '$lib/constants/validationMessages';

const email = z
	.string({ required_error, invalid_type_error })
	.email({ message: invalid_type_error })
	.toLowerCase()
	.trim();

const emailSchema = z.object({ email });
type EmailSchema = typeof emailSchema;

const password = z
	.string({ required_error, invalid_type_error })
	.min(8, { message: min_length_error(8) });

const signupSchema = z
	.object({
		email,
		password,
		confirm_password: password,
	})
	.refine((data) => data.password === data.confirm_password, {
		message: mismatching_passwords_error,
		path: ['confirm_password'],
	});

type SignupSchema = typeof signupSchema;

const loginSchema = z.object({
	email: email,
	password: password,
});

type LoginSchema = typeof loginSchema;

const verificationCode = z
	.string({ required_error, invalid_type_error })
	.length(8, { message: exactly_length_error(8) })
	.regex(/^\d+$/, {
		message: invalid_format('solo se permiten números.'),
	})
	.trim();

const verificationCodeSchema = z.object({ verificationCode });

type VerificationCodeSchema = typeof verificationCodeSchema;

const resetPasswordSchema = z
	.object({
		password,
		confirm_password: password,
	})
	.refine((data) => data.password === data.confirm_password, {
		message: mismatching_passwords_error,
		path: ['confirm_password'],
	});

type ResetPasswordSchema = typeof resetPasswordSchema;

export {
	signupSchema,
	loginSchema,
	verificationCodeSchema,
	emailSchema,
	resetPasswordSchema,
	type SignupSchema,
	type LoginSchema,
	type VerificationCodeSchema,
	type EmailSchema,
	type ResetPasswordSchema,
};
