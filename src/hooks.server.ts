import { dev } from '$app/environment';
import {
	loginUrl,
	onlyLoggedUrls,
	onlyWithActiveSessionUrls,
	unprotectedUrls,
} from '$lib/constants/urls';
import { initializeLucia } from '$lib/server/lucia/auth';
import { getPrismaClient } from '$lib/server/clients/prisma';
import { error, redirect, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

const setPlatformAndAuth: Handle = async ({ event, resolve }) => {
	/**
	 * On dev mode, we need to get the platform proxy from the wrangler state
	 * We need to do it because the wrangler state is not available unless the app is built
	 * with wrangler pages dev. But this gives a slower dev mode experience, so we proxy it.
	 * See: https://blog.cloudflare.com/blazing-fast-development-with-full-stack-frameworks-and-cloudflare
	 * On production, we only check if platform is defined in the env
	 */
	if (dev) {
		const { getPlatformProxy } = await import('wrangler');
		event.platform = await getPlatformProxy();
	}
	const { platform } = event;
	if (!platform) {
		error(500, 'Ha ocurrido un error interno.');
	}
	const { env } = platform;

	const db = env.DB;

	event.locals.db = db;
	const prismaClient = getPrismaClient(db);
	const lucia = initializeLucia(prismaClient);
	const sessionId = event.cookies.get(lucia.sessionCookieName);
	event.locals.prismaClient = prismaClient;
	event.locals.lucia = lucia;

	if (!sessionId) {
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}

	const { session, user } = await lucia.validateSession(sessionId);

	if (session && session.fresh) {
		const sessionCookie = lucia.createSessionCookie(session.id);
		// sveltekit types deviates from the de-facto standard
		// you can use 'as any' too
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes,
		});
	}

	if (!session) {
		const sessionCookie = lucia.createBlankSessionCookie();
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes,
		});
	}

	event.locals.user = user;
	event.locals.session = session;
	return resolve(event);
};

const authGuard: Handle = async ({ event, resolve }) => {
	const {
		url: { pathname },
	} = event;
	const { user, session } = event.locals;
	const authenticatedUser =
		user !== null && session !== null && user.emailVerified && session.userVerified;
	if (authenticatedUser && unprotectedUrls.has(pathname)) {
		redirect(302, '/');
	}
	/**
	 * A session is needed to see `onlyWithActiveSessionUrls` pages.
	 * An `authenticatedUser` is needed to see `onlyLoggedUrls` urls.
	 */
	if (
		(!session && onlyWithActiveSessionUrls.has(pathname)) ||
		(!authenticatedUser && onlyLoggedUrls.has(pathname))
	) {
		redirect(302, loginUrl);
	}

	event.locals.authenticatedUser = authenticatedUser;
	return resolve(event);
};

export const handle: Handle = sequence(setPlatformAndAuth, authGuard);
