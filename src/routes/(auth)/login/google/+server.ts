import { redirect } from "@sveltejs/kit";
import { generateState, generateCodeVerifier } from "arctic";

import type { RequestEvent } from "@sveltejs/kit";
import { google } from "$lib/server/lucia/auth";
import { dev } from "$app/environment";
import { GOOGLE_CODE_VERIFIER_COOKIE, GOOGLE_STATE_COOKIE } from "$lib/constants/cookies";

export async function GET(event: RequestEvent): Promise<Response> {
	const state = generateState();
    const codeVerifier = generateCodeVerifier();
    const scopes = ["openid", "profile", "email"];
    const url = await google.createAuthorizationURL(state, codeVerifier, {scopes});

	event.cookies.set(GOOGLE_STATE_COOKIE, state, {
		path: "/",
		secure: !dev,
		httpOnly: true,
		maxAge: 60 * 10,
		sameSite: "lax"
	});

    event.cookies.set(GOOGLE_CODE_VERIFIER_COOKIE, codeVerifier, {
		path: "/",
		secure: !dev,
		httpOnly: true,
		maxAge: 60 * 10,
		sameSite: "lax"
	});
	redirect(302, url.toString());
}