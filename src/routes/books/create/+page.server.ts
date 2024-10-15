import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageServerLoad } from './$types';
import { bookSchema } from '$lib/validation/book';
import { error } from '@sveltejs/kit';

/**
 * Defined outside the load function so the adapter can be cached
 * https://superforms.rocks/get-started#schema-caching
 */
const schema = bookSchema;

export const load: PageServerLoad = async ({
    platform: {
        env: { BOOKS_KV_DEV }
    },
    url,
    locals: { user }
}) => {
    const { searchParams } = url;
    const book = searchParams.get('book');

    if (!user) {
        return error(403, 'Access denied: You do not have permission to perform this action.');
    }

    let bookData: { textArray: Book.Page[] };
    let newBookCode;

    if (!book) {
        // Is a new book
        newBookCode = crypto.randomUUID();
        bookData = {
            textArray: [
                {
                    frontPageTitle: '',
                    id: crypto.randomUUID(),
                    backPageTitle: ''
                }
            ]
        };
    } else {
        // Try to get book data from the KV
        bookData = await BOOKS_KV_DEV.get(`user:${user.id}:book:${book}`);
        if (!bookData) {
            return error(404, 'The book you are trying to edit doesn\'t exist.');
        }
    }

    return {
        form: await superValidate(bookData, zod(schema)),
        newBookCode
    };
};
