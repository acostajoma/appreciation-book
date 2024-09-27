import { redirect } from "@sveltejs/kit";
import { generateState } from "arctic";

import type { RequestEvent } from "@sveltejs/kit";
import { facebook } from "$lib/server/lucia/auth";
import { dev } from "$app/environment";
import {  FACEBOOK_STATE_COOKIE } from "$lib/constants/cookies";

export async function GET(event: RequestEvent): Promise<Response> {
	const state = generateState();
    const scopes = [/* "email", @todo add email **/ "public_profile"];
    const url = await facebook.createAuthorizationURL(state, {scopes});

	event.cookies.set(FACEBOOK_STATE_COOKIE, state, {
		path: "/",
		secure: !dev,
		httpOnly: true,
		maxAge: 60 * 10,
		sameSite: "lax"
	});

	redirect(302, url.toString());
}