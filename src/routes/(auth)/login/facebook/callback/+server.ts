// import type { PageServerLoad } from './$types';
import { OAuth2RequestError } from "arctic";
import { generateIdFromEntropySize } from "lucia";
import { facebook } from "$lib/server/lucia/auth";

import { error, redirect, type RequestEvent, type RequestHandler } from "@sveltejs/kit";
import { FACEBOOK_STATE_COOKIE } from "$lib/constants/cookies";

export const GET: RequestHandler = async ({url, cookies, locals : {lucia, prismaClient}, getClientAddress } : RequestEvent)  => {
// export const load: PageServerLoad = async ({url, cookies, locals : {lucia, prismaClient}, getClientAddress } : RequestEvent)  => {
	const code = url.searchParams.get("code");
	const state = url.searchParams.get("state");
	const storedState = cookies.get(FACEBOOK_STATE_COOKIE) ?? null;



	if (code === null || storedState === null || state !== storedState) {
		return error(400)
	}
    
	try {
		const tokens = await facebook.validateAuthorizationCode(code);

        const { accessToken } = tokens
        
		const url = new URL("https://graph.facebook.com/me");
		url.searchParams.set("access_token", accessToken);
		url.searchParams.set("fields", ["id", "name", "picture", "email"].join(","));
        const response = await fetch(url);
        const user : User.Facebook = await response.json();

		// Replace this with your own DB client.
		const existingUser = await prismaClient.oAuthAccount.findFirst({
			where: {
				providerUserId : user.id,    
                providerId: 'facebook'
			}
		})
        
		if (existingUser) {
			const session = await lucia.createSession(existingUser.userId, {
                ipAddress : getClientAddress(),
                userVerified: true
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
                    email: user?.email,
                    OAuthAccount:{
                        create : {
                            providerId: 'facebook',
                            providerUserId: user.id,
                        }
                    }
                }
            })
			

			const session = await lucia.createSession(userId, {
                ipAddress : getClientAddress(),
                userVerified: true
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