import { object, string, date } from 'zod';

const directorSchema = object({
    name: string({
        required_error: 'Name is required',
        invalid_type_error: 'Name must be a string'
    }).min(2).max(255),
    birthDate: string({
        required_error: 'Birth date is required',
        invalid_type_error: 'Birth date must be a string'
    }).refine((val) => !isNaN(Date.parse(val)), {
        message: 'Birth date must be a valid date'
    }).transform((val) => new Date(val)),
    email: string({
        required_error: 'Email is required',
        invalid_type_error: 'Email must be a string'
    }).email().min(5).max(255),
    phone: string({
        required_error: 'Phone is required',
        invalid_type_error: 'Phone must be a string'
    }).min(5).max(20)
});

export function validateDirector(director) {
    return directorSchema.safeParse(director);
}

export function validatePartialDirector(director) {
    return directorSchema.partial().safeParse(director);
}