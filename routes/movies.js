import { Router } from 'express';
import { writeFileSync, readFileSync } from 'node:fs';
import { path } from 'node:path';
import { randomUUID } from 'node:crypto';
import { validateMovie, validatePartialMovie } from '../schemas/movies.js';

const movieRouter = Router();
const moviePath = path.join(__dirname, '../movies.json');
const movies = JSON.parse(readFileSync(moviePath, 'utf-8')); // Load movies from JSON file

movieRouter.get('/', (req, res) => {
    res.send('Hello World!');
});

movieRouter.get('/movies', (req, res) => {
    const { genre } = req.query; // Get the genre from request query parameters
    if (genre) {
        const filteredMovies = movies.filter(
            movie => movie.genre.toLowerCase() === genre.toLowerCase() // Filter movies by genre if provided
        );
        return res.json(filteredMovies);
    }
    res.json(movies); // Return all movies if no genre is specified
});

movieRouter.get('/movies/:id', (req, res) => {
    const id = req.params.id;
    const movie = movies.find(movie => movie.id === id); // Find movie by ID

    if (!movie) {
        return res.status(404).json({ message: 'Movie not found' });
    }

    res.json(movie);
});

movieRouter.post('/movies', (req, res) => { // Route to create a new movie, supporting single or multiple movie creation
    const moviesArray = Array.isArray(req.body) ? req.body : [req.body]; // Handle both single object and array in request body
    const newMovies = [];

    for (const movieData of moviesArray) {
        const result = validateMovie(movieData); // Validate movie data

        if (result.error) {
            return res.status(422).json({ message: result.error.message });
        }

        const newMovie = { // Create a new movie object
            id: randomUUID(),
            ...movieData
        };

        movies.push(newMovie);
        newMovies.push(newMovie);
    }

    writeFileSync('./movies.json', JSON.stringify(movies, null, 2));

    res.status(201).json(newMovies);
});

movieRouter.patch('/movies/:id', (req, res) => {
    const { id } = req.params;
    const movie = movies.find(movie => movie.id === id); // Find movie by ID

    if (!movie) {
        return res.status(404).json({ message: 'Movie not found' });
    }

    const result = validatePartialMovie(req.body); // Partially validate movie data

    if (result.error) {
        return res.status(422).json({ message: result.error.message });
    }

    Object.assign(movie, req.body); // Update movie with new data

    writeFileSync('./movies.json', JSON.stringify(movies, null, 2)); // Save updated movies list

    res.json(movie);
});

export { movieRouter };
