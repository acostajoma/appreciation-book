import { dev } from '$app/environment';
import { PrismaAdapter } from '@lucia-auth/adapter-prisma';
import type { PrismaClient } from '@prisma/client/extension';
import { Lucia } from 'lucia';

export function initializeLucia(client: PrismaClient) {
	const adapter = new PrismaAdapter(client.session, client.user);

	return new Lucia(adapter, {
		sessionCookie: {
			attributes: {
				secure: !dev, // set to `true` when using HTTPS
			},
		},
		getUserAttributes: (attributes) => {
			return {
				email: attributes.email,
				emailVerified: attributes.emailVerified,
			};
		},
		getSessionAttributes: (attributes) => {
			return {
				ipAddress: attributes.ipAddress,
				userVerified: attributes.userVerified,
			};
		},
	});
}


export type LuciaType = ReturnType<typeof initializeLucia>;

declare module 'lucia' {
	interface Register {
		Lucia: LuciaType;
		DatabaseUserAttributes: DatabaseUserAttributes;
		DatabaseSessionAttributes: DatabaseSessionAttributes;
	}
	interface DatabaseUserAttributes {
		email: string;
		emailVerified: boolean;
	}
	interface DatabaseSessionAttributes {
		ipAddress: string;
		userVerified: boolean;
	}
}
