const z = require('zod');

const movieSchema = z.object({
    title: z.string({
        required_error: 'Title is required',
        invalid_type_error: 'Title must be a string'
    }),
    director: z.string({
        required_error: 'Director is required',
        invalid_type_error: 'Director must be a string'
    }),
    year: z.number({
        required_error: 'Year is required',
        invalid_type_error: 'Year must be a number'
    }).int().min(1900).max(new Date().getFullYear()),
    genre: z.string({
        required_error: 'Genre is required',
        invalid_type_error: 'Genre must be a string'
    }),
    rating: z.number({
        required_error: 'Rating is required',
        invalid_type_error: 'Rating must be a number'
    })
    .min(0).max(10),
    duration: z.number({
        required_error: 'Duration is required',
        invalid_type_error: 'Duration must be a number'
    }).int().min(1)
});

function validateMovie(movie) {
    return movieSchema.safeParse(movie);
}

function validatePartialMovie(movie) {
    return movieSchema.partial().safeParse(movie);
}

module.exports = {
    validateMovie,
    validatePartialMovie
};