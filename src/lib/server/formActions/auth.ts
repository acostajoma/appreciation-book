import { error, fail, redirect, type Action } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import {
	errorValidatingUser,
	forbiddenActionError,
	invalidCodeError,
} from '$lib/constants/formActionMessages';
import { verifyEmailCode } from '$lib/server/utils';
import { verificationCodeSchema } from '$lib/validation/auth';

export const verifyUser: Action = async ({
	request,
	locals: { lucia, session, prismaClient },
	cookies,
	getClientAddress,
}) => {
	const form = await superValidate(request, zod(verificationCodeSchema));

	if (!form.valid) {
		return fail(400, { form });
	}

	if (!session) {
		form.message = errorValidatingUser;
		return fail(401, { form });
	}

	const { user } = await lucia.validateSession(session.id);
	if (!user) {
		form.message = forbiddenActionError;
		return fail(401, { form });
	}

	const code = form.data.verificationCode;
	const validCode = await verifyEmailCode(user, code, prismaClient);
	if (!validCode) {
		form.message = invalidCodeError;
		return fail(404, { form });
	}

	await lucia.invalidateUserSessions(user.id);

	if (!user.emailVerified) {
		try {
			await prismaClient.user.update({
				where: {
					id: user.id,
				},
				data: {
					emailVerified: true,
				},
			});
		} catch (err) {
			console.error(err);
			error(500, {
				message: 'Error interno',
			});
		}
	}

	const newSession = await lucia.createSession(user.id, {
		ipAddress: getClientAddress(),
		userVerified: true,
	});
	const sessionCookie = lucia.createSessionCookie(newSession.id);
	cookies.set(sessionCookie.name, sessionCookie.value, {
		path: '.',
		...sessionCookie.attributes,
	});

	redirect(302, '/');
};
