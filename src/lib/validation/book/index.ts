import { z } from 'zod';
import {
	invalid_type_error,
	required_error,
} from '$lib/constants/validationMessages';

const text = z
    .string({ required_error, invalid_type_error })
    .trim();

const sheet = z
    .object({
        frontPageTitle: text.optional(), 
        backPageTitle: text.optional(), 
        id: text 
    })

export const bookSchema = z
    .object({
        textArray : sheet.array()
    })