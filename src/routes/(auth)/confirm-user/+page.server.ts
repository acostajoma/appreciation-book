import type { Actions, PageServerLoad } from './$types';
import { verifyUser } from '$lib/server/formActions/auth';
import { verificationCodeSchema } from '$lib/validation/auth';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

/**
 * Defined outside the load function so the adapter can be cached
 * https://superforms.rocks/get-started#schema-caching
 */
const schema = verificationCodeSchema;
export const load: PageServerLoad = async () => ({
	form: await superValidate(zod(schema))
})

export const actions = {
	default: verifyUser,
} satisfies Actions;
