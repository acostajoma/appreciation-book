import { invalidEmailOrPassword } from '$lib/constants/formActionMessages';
import { handleEmailVerification, validateAuthForm } from '$lib/server/utils';
import { loginSchema } from '$lib/validation/auth';
import { sha512 } from '@noble/hashes/sha512';
import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';

/**
 * Defined outside the load function so the adapter can be cached
 * https://superforms.rocks/get-started#schema-caching
 */
const schema = loginSchema;

export const load: PageServerLoad = async () => {
	return {
		form: await superValidate(zod(schema)),
	};
};

export const actions: Actions = {
	default: async ({ request, cookies, locals: { lucia, prismaClient }, getClientAddress }) => {
		const { success, email, form, callback, password, userData } = await validateAuthForm(
			request,
			loginSchema,
			prismaClient,
		);

		if (!success && callback) {
			return callback();
		}
		/** NOTE:
		Returning immediately allows malicious actors to figure out valid emails from response times,
		allowing them to only focus on guessing passwords in brute-force attacks. As a preventive
		measure, you may want to hash passwords even for invalid emails. However, valid emails 
		can be already be revealed with the signup page among other methods. It will also be much more 
		resource intensive.Since protecting against this is non-trivial,it is crucial your implementation
		 is protected against brute-force attacks with login throttling etc.If emails are public, 
		 you may outright tell the user that the email is invalid.
		*/
		if (!userData) {
			form.message = invalidEmailOrPassword;
			return fail(400, { form });
		}

		const { id, passwordHash } = userData;
		const hashedPassword = await sha512(password).toString();

		if (passwordHash !== hashedPassword) {
			form.message = invalidEmailOrPassword;
			return fail(400, { form });
		}

		return await handleEmailVerification(
			id,
			email,
			prismaClient,
			form,
			lucia,
			getClientAddress,
			cookies,
		);
	},
};
