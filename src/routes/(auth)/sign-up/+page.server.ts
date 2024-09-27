import { emailAlreadyInUse } from '$lib/constants/formActionMessages';
import { handleEmailVerification, validateAuthForm } from '$lib/server/utils';
import { signupSchema } from '$lib/validation/auth';
import { sha512 } from '@noble/hashes/sha512';
import { error, fail } from '@sveltejs/kit';
import { generateIdFromEntropySize } from 'lucia';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';

/**
 * Defined outside the load function so the adapter can be cached
 * https://superforms.rocks/get-started#schema-caching
 */
const schema = signupSchema;

export const load: PageServerLoad = async () => {
	const form = await superValidate(zod(schema));
	return {
		form,
	};
};

export const actions: Actions = {
	default: async ({ cookies, request, locals: { prismaClient, lucia }, getClientAddress }) => {
		const { success, form, callback, email, password, userData } = await validateAuthForm(
			request,
			signupSchema,
			prismaClient,
		);
		if (!success && callback) {
			return callback();
		}

		/** If some user data is in the variable then email is taken */
		if (userData !== undefined) {
			form.message = emailAlreadyInUse;
			return fail(403, { form });
		}

		const userId = generateIdFromEntropySize(10); // 16 characters long
		const passwordHash = await sha512(password).toString();
		try {
			await prismaClient.user.create({
				data: {
					id: userId,
					email,
					emailVerified: false,
					passwordHash,
				},
			});
			console.log('Se ha agregado un nuevo usuario');
		} catch (err) {
			console.error(err);
			return error(500, 'Ha ocurrido un error interno.');
		}
		const verificationResult = await handleEmailVerification(
			userId,
			email,
			prismaClient,
			form,
			lucia,
			getClientAddress,
			cookies,
		);
		return verificationResult;
	},
};
