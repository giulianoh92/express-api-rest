import { object, string, number } from 'zod';

const movieSchema = object({
    title: string({
        required_error: 'Title is required',
        invalid_type_error: 'Title must be a string'
    }),
    director: string({
        required_error: 'Director is required',
        invalid_type_error: 'Director must be a string'
    }),
    year: number({
        required_error: 'Year is required',
        invalid_type_error: 'Year must be a number'
    }).int().min(1900).max(new Date().getFullYear()),
    genre: string({
        required_error: 'Genre is required',
        invalid_type_error: 'Genre must be a string'
    }),
    rating: number({
        required_error: 'Rating is required',
        invalid_type_error: 'Rating must be a number'
    })
    .min(0).max(10),
    duration: number({
        required_error: 'Duration is required',
        invalid_type_error: 'Duration must be a number'
    }).int().min(1)
});

export function validateMovie(movie) {
    return movieSchema.safeParse(movie);
}

export function validatePartialMovie(movie) {
    return movieSchema.partial().safeParse(movie);
}
