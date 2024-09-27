import { ENV_LINK } from '$env/static/private';
import { error, fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';

import { dev } from '$app/environment';
import {
	internalServerError,
	invalidEmail,
	sendTemporalPasswordError,
} from '$lib/constants/formActionMessages';
import { passwordResetEmailConfirmation, resetPasswordUrl } from '$lib/constants/urls';
import { resetPasswordEmailTemplate } from '$lib/server/constants';
import { sendEmail } from '$lib/server/utils';
import {
	checkLogAttempts,
	createPasswordResetToken,
	logVerificationAttemptData,
} from '$lib/server/utils/authHelpers';
import { emailSchema } from '$lib/validation/auth';

/**
 * Defined outside the load function so the adapter can be cached
 * https://superforms.rocks/get-started#schema-caching
 */
const schema = emailSchema;
export const load: PageServerLoad = async () => ({ form: await superValidate(zod(schema)) });

export const actions: Actions = {
	default: async ({ request, locals: { prismaClient }, getClientAddress }) => {
		const form = await superValidate(request, zod(schema));
		const {
			data: { email },
			valid,
		} = form;

		if (!valid) {
			form.message = invalidEmail;
			return fail(400, { form });
		}

		let success = false;
		try {
			const selectedUser = await prismaClient.user.findFirst({
				where: { email },
			});

			if (!selectedUser) {
				form.message = invalidEmail;
				return fail(400, { form });
			}

			const ipAddress = getClientAddress();
			const type = 'password_reset';
			const throttleResult = await checkLogAttempts(prismaClient, selectedUser.id, ipAddress, type);

			if (!throttleResult.allowed) {
				form.message = { message: throttleResult.reason as string, success: false };
				return fail(405, { form });
			}

			const verificationToken = await createPasswordResetToken(prismaClient, selectedUser.id);
			const verificationLink = ENV_LINK + resetPasswordUrl + '?token=' + verificationToken;
			if (dev) console.log(verificationLink); // Needed because when running locally, emails are not sent

			const successfullySent = await sendEmail(resetPasswordEmailTemplate(email, verificationLink));
			if (!successfullySent) {
				form.message = sendTemporalPasswordError;
				return fail(500, { form });
			}
			logVerificationAttemptData(prismaClient, {
				userId: selectedUser.id,
				ipAddress: ipAddress,
				attemptTime: new Date(),
				type,
			});
			success = true;
		} catch (err) {
			console.error(err);
			error(500, 'Ha ocurrido un error interno');
		}
		if (success) return redirect(302, passwordResetEmailConfirmation);
		form.message = internalServerError;
		return fail(500, { form });
	},
};
