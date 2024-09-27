import { dev } from '$app/environment';
import { SENDGRID_API_KEY } from '$env/static/private';
import { sha256 } from '@noble/hashes/sha256';
import { error, fail, redirect, type Cookies } from '@sveltejs/kit';
import { generateIdFromEntropySize, type Lucia, type User } from 'lucia';
import { isWithinExpirationDate } from 'oslo';
import { alphabet, generateRandomString } from 'oslo/crypto';
import { zod } from 'sveltekit-superforms/adapters';

import { sendEmailVerificationError } from '$lib/constants/formActionMessages';
import { validateUserUrl } from '$lib/constants/urls';
import { verificationCodeEmailTemplate } from '$lib/server/constants';
import { getDate } from '$lib/utils/time';
import type { LoginSchema, SignupSchema } from '$lib/validation/auth';
import { superValidate, type Infer, type SuperValidated } from 'sveltekit-superforms';
import { encodeHex } from '../encoders';
type SuperValidatedForm = SuperValidated<Infer<SignupSchema | LoginSchema>>;

type ValidateAuthForm = (
	request: Request,
	schema: SignupSchema | LoginSchema,
	prismaClient: App.Locals['prismaClient'],
) => Promise<{
	success: boolean;
	form: SuperValidatedForm;
	email: string;
	password: string;
	callback?: () => void;
	userData?: Database.User;
}>;

/**
 * @param userId Lucia User  Id
 * @param email The user email
 * @param db The Cloudflare D1 database
 * @returns null if an error occurred during the process. Otherwise, returns the generated code.
 */
export async function generateEmailVerificationCode(
	userId: string,
	email: string,
	prismaClient: App.Locals['prismaClient'],
): Promise<string | null> {
	try {
		const code = generateRandomString(8, alphabet('0-9'));
		/**
		 * Delete previous verification code, so we don't have the DB full of expired codes
		 * that way we improve performance and don't have to query the whole table.
		 */
		await prismaClient.verificationCode.deleteMany({
			where: {
				email,
			},
		});

		const currentDate = new Date();
		const in15Minutes = new Date(currentDate.getTime() + 900000);
		const newCode = await prismaClient.verificationCode.create({
			data: {
				userId,
				email,
				code,
				expiresAt: in15Minutes,
			},
		});
		return newCode.code;
	} catch (error) {
		console.error('Error al generar el código de verificación', error);
		return null;
	}
}

/**
 * This function sends an email using the SendGrid API. It is used to verify the user's email address or send sign-in tokens.
 * @param data SendGrid Data
 * @returns true if it was sent successfully. False if an error occurred during the process.
 */
export async function sendEmail(data: SendGrid.EmailData): Promise<boolean> {
	const url = 'https://api.sendgrid.com/v3/mail/send';
	let success = false;
	try {
		await fetch(url, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${SENDGRID_API_KEY}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		});
		success = true;
	} catch (error) {
		console.error('Error al enviar el correo: ', error);
	}
	return success;
}

export async function verifyEmailCode(
	user: User,
	inputCode: string,
	prismaClient: App.Locals['prismaClient'],
): Promise<boolean> {
	try {
		// We can use findFirst as we delete all other tokens, the last one should be the only one on the DB
		const verificationCode = await prismaClient.verificationCode.findFirst({
			where: {
				userId: user.id,
			},
		});
		if (
			verificationCode !== null &&
			verificationCode.code === inputCode &&
			isWithinExpirationDate(verificationCode.expiresAt) &&
			verificationCode.email === user.email
		) {
			return true;
		}
		return false;
	} catch (err) {
		console.error(err);
		return false;
	}
}

//@todo solve this issue
export const validateAuthForm: ValidateAuthForm = async (request, schema, prismaClient) => {
	const formData = await request.formData();
	const confirm_password = formData.has('confirm_password');
	const form: SuperValidatedForm = await superValidate(formData, zod(schema));

	const { email, password } = form.data;

	// Replace passwords in the form data with an empty string for security
	form.data.password = '';
	if (confirm_password && 'confirm_password' in form.data) {
		form.data.confirm_password = '';
	}

	if (!form.valid) {
		return {
			success: false,
			form,
			email,
			password,
			callback: () => fail(400, { form }),
		};
	}

	try {
		const userData = await prismaClient.user.findFirst({
			where: {
				email,
			},
		});

		return {
			success: true,
			form,
			email,
			password,
			userData: userData ?? undefined,
		};
	} catch (err) {
		console.error(err);
		return {
			success: false,
			form,
			callback: () => error(500, { message: 'Ha ocurrido un error interno' }),
			email,
			password,
		};
	}
};

/**
 * Used on login and signup to handle the email verification.
 * It generates a token and sends it through the given email.
 */
export const handleEmailVerification = async (
	userId: string,
	email: string,
	prismaClient: App.Locals['prismaClient'],
	form: SuperValidated<Infer<SignupSchema | LoginSchema>>,
	lucia: Lucia,
	getClientAddress: () => string,
	cookies: Cookies,
) => {
	const ipAddress = getClientAddress();
	const throttleResult = await checkLogAttempts(
		prismaClient,
		userId,
		ipAddress,
		'verification_code',
	);
	if (!throttleResult.allowed) {
		form.message = { message: throttleResult.reason as string, success: false };
		return fail(429, { form });
	}

	const verificationCode = await generateEmailVerificationCode(userId, email, prismaClient);
	if (!verificationCode) {
		form.message = sendEmailVerificationError;
		return fail(500, { form });
	}

	if (dev) {
		console.log('attemptLogs: ', throttleResult);
		console.log('The verification Code is:', verificationCode);
	}

	const successfullySent = await sendEmail(verificationCodeEmailTemplate(email, verificationCode));
	if (!successfullySent) {
		form.message = sendEmailVerificationError;
		return fail(500, { form });
	}
	await logVerificationAttemptData(prismaClient, {
		userId: userId,
		ipAddress: ipAddress,
		attemptTime: new Date(),
		type: 'verification_code',
	});
	const session = await lucia.createSession(userId, {
		ipAddress: ipAddress,
		userVerified: false,
	});
	const sessionCookie = lucia.createSessionCookie(session.id);

	cookies.set(sessionCookie.name, sessionCookie.value, {
		path: '.',
		...sessionCookie.attributes,
	});
	return redirect(302, validateUserUrl);
};

export async function logVerificationAttemptData(
	prismaClient: App.Locals['prismaClient'],
	{ userId, ipAddress, attemptTime, type }: Database.VerificationAttempt,
) {
	try {
		await prismaClient.verificationAttempt.create({
			data: {
				userId,
				ipAddress,
				attemptTime,
				type,
			},
		});
		return true;
	} catch (error) {
		console.error(error);
		return false;
	}
}

/**
 * Get the logs of the login/signup attempts using the ipAddress and userId
 * @param db D1Database
 * @param userId user id
 * @param ipAddress ip address that getCLientAddress returns
 */
export async function checkLogAttempts(
	prismaClient: App.Locals['prismaClient'],
	userId: string,
	ipAddress: string,
	type: Database.VerificationAttempt['type'],
): Promise<{
	allowed: boolean;
	reason?: string;
}> {
	const currentDate = new Date();
	const pastDate = new Date(currentDate.getTime() - 1800000);

	try {
		// We don't use count so we can only take 5 records and stop running the query if that happens
		const records = await prismaClient.verificationAttempt.findMany({
			where: {
				userId,
				ipAddress,
				attemptTime: {
					gte: pastDate,
				},
				type,
			},
			take: 5,
		});

		const totalAttempts = records.length;
		if (totalAttempts >= 5) {
			const message =
				'Demasiados intentos de autenticación para este usuario o  dirección IP en los últimos 30 minutos.';
			console.error(message);
			return { allowed: false, reason: message };
		}
		return { allowed: true };
	} catch (err) {
		console.error(err);
		return {
			allowed: false,
			reason: 'Ha ocurrido un error interno',
		};
	}
}

export async function createPasswordResetToken(
	prismaClient: App.Locals['prismaClient'],
	userId: string,
): Promise<string | null> {
	try {
		// invalidate other passwordResetToken for this user
		await prismaClient.passwordResetToken.deleteMany({
			where: {
				userId,
			},
		});

		const tokenId = generateIdFromEntropySize(25); // 40 character
		const tokenHash = encodeHex(await sha256(new TextEncoder().encode(tokenId)));

		await prismaClient.passwordResetToken.create({
			data: {
				tokenHash,
				userId,
				expiresAt: getDate('future', 'm', 15),
			},
		});

		return tokenId;
	} catch (err) {
		console.log(err);
		return null;
	}
}

/**
 * Create a constant called validToken and save the value this function returns in it.
 * @param db D1Database
 * @param token token from the password_reset_token table
 * @returns {Promise<Database.PasswordResetToken | null>} data if valid and null otherwise
 */
export async function verifyToken(
	prismaClient: App.Locals['prismaClient'],
	token: string,
	deleteToken?: boolean,
): Promise<Database.PasswordResetToken | null> {
	try {
		const tokenHash = encodeHex(await sha256(new TextEncoder().encode(token)));
		const selectedToken = await prismaClient.passwordResetToken.findFirst({
			where: {
				tokenHash,
			},
		});

		if (!selectedToken || !isWithinExpirationDate(selectedToken.expiresAt)) {
			return null;
		}

		if (selectedToken && deleteToken) {
			await prismaClient.passwordResetToken.delete({
				where: { tokenHash },
			});
		}

		return selectedToken;
	} catch (error) {
		console.error(error);
		return null;
	}
}
