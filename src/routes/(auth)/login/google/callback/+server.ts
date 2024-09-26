// import type { PageServerLoad } from './$types';
import { OAuth2RequestError } from "arctic";
import { generateIdFromEntropySize } from "lucia";
import { google } from "$lib/server/lucia/auth";

import { error, redirect, type RequestEvent, type RequestHandler } from "@sveltejs/kit";
import { GOOGLE_CODE_VERIFIER_COOKIE, GOOGLE_STATE_COOKIE } from "$lib/constants/cookies";

export const GET: RequestHandler = async ({url, cookies, locals : {lucia, prismaClient}, getClientAddress } : RequestEvent)  => {
// export const load: PageServerLoad = async ({url, cookies, locals : {lucia, prismaClient}, getClientAddress } : RequestEvent)  => {
	const code = url.searchParams.get("code");
	const state = url.searchParams.get("state");
	const storedState = cookies.get(GOOGLE_STATE_COOKIE) ?? null;
    const storedCodeVerifier = cookies.get(GOOGLE_CODE_VERIFIER_COOKIE) ?? null



	if (code === null || storedState === null || state !== storedState || storedCodeVerifier === null) {
		return error(400)
	}
    
	try {
		const tokens = await google.validateAuthorizationCode(code, storedCodeVerifier);

        const { accessToken } = tokens
        
        const response = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        const user : User.Google = await response.json();

		// Replace this with your own DB client.
		const existingUser = await prismaClient.oAuthAccount.findFirst({
			where: {
				providerUserId : user.sub,    
                providerId: 'google'
			}
		})
        
		if (existingUser) {
			const session = await lucia.createSession(existingUser.userId, {
                ipAddress : getClientAddress(),
                userVerified: user.email_verified
            });
			const sessionCookie = lucia.createSessionCookie(session.id);
			cookies.set(sessionCookie.name, sessionCookie.value, {
				path: ".",
				...sessionCookie.attributes
			});
		} else {
			const userId = generateIdFromEntropySize(10); // 16 characters long

            await prismaClient.user.create({
                data :{
                    id: userId,
                    emailVerified: true,
                    email: user.email,
                    OAuthAccount:{
                        create : {
                            providerId: 'google',
                            providerUserId: user.sub,
                        }
                    }
                }
            })
			

			const session = await lucia.createSession(userId, {
                ipAddress : getClientAddress(),
                userVerified: user.email_verified
            });
			const sessionCookie = lucia.createSessionCookie(session.id);
			cookies.set(sessionCookie.name, sessionCookie.value, {
				path: ".",
				...sessionCookie.attributes
			});
		}

	} catch (e) {
        console.log(e)
		if (e instanceof OAuth2RequestError) {
			// invalid code
			error(400, e.message)
		}
        error(500, 'Oops. An internal error has ocurred')
	}
    return redirect(302,"/")
}