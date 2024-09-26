import { z } from 'zod';
import {
	invalid_type_error,
	min_length_error,
	required_error,
    max_length_error,
    invalid_phone_number,
} from '$lib/constants/validationMessages';

const name = z
    .string({ required_error, invalid_type_error })
    .trim()
    .min(2, min_length_error(2))
    .max(30, max_length_error(30))

const lastName = name
    .nullable()

const phone = z
    .string({ required_error, invalid_type_error })
    .regex(/^\d{7,10}$/, invalid_phone_number)
    .transform((value) => value.replace(/\D/g, '')
    .trim());

const countryCode = z
    .number({ required_error, invalid_type_error })
    .step(1)
    .lte(999)
    .gt(0)

const contactDataSchema = z
    .object({
        name,
        lastName,
        phone,
        countryCode
    })
    .partial({
        lastName: true
    })

type ContactDataSchema = typeof contactDataSchema;


export {
	contactDataSchema,
    type ContactDataSchema
};
