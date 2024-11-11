const express = require('express');
const fs = require('node:fs');
const cors = require('cors');
const crypto = require('node:crypto');
const movies = require('./movies.json');
const { validateMovie, validatePartialMovie } = require('./schemas/movies');

const app = express();
app.disable('x-powered-by'); // Deshabilita la cabecera X-Powered-By
const port = process.env.PORT ?? 3000;

app.use(express.json());
app.use(cors({
    origin: (origin, callback) => {
        const ACCEPTED_ORIGINS = [
            'http://localhost:3000', 
            'http://localhost:8080', 
            'https://my-app.com'
        ];
        if (ACCEPTED_ORIGINS.includes(origin)) {
            return callback(null, true);
        }

        callback(new Error('Not allowed by CORS'));
    }
}));

app.get('/', (req, res) => {
    res.json({ message: 'Hello World' });
});

app.get('/movies', (req, res) => {
    const { genre } = req.query;
    if (genre) {
        const filteredMovies = movies.filter(
            movie => movie.genre.toLowerCase() === genre.toLowerCase()
        );
        return res.json(filteredMovies);
    }
    res.json(movies);
});

app.get('/movies/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const movie = movies.find(movie => movie.id === id);

    if (!movie) {
        return res.status(404).json({ message: 'Movie not found' });
    }

    res.json(movie);
});

app.post('/movies', (req, res) => {
    const moviesArray = Array.isArray(req.body) ? req.body : [req.body];
    const newMovies = [];

    for (const movieData of moviesArray) {
        const result = validateMovie(movieData);

        if (result.error) {
            return res.status(422).json({ message: result.error.message });
        }

        const newMovie = {
            id: crypto.randomUUID(),
            ...movieData
        };

        movies.push(newMovie);
        newMovies.push(newMovie);
    }

    fs.writeFileSync('./movies.json', JSON.stringify(movies, null, 2));

    res.status(201).json(newMovies);
});

app.patch('/movies/:id', (req, res) => {
    const { id } = req.params;
    const movie = movies.find(movie => movie.id === id);

    if (!movie) {
        return res.status(404).json({ message: 'Movie not found' });
    }

    const result = validatePartialMovie(req.body);

    if (result.error) {
        return res.status(422).json({ message: result.error.message });
    }

    Object.assign(movie, req.body);

    fs.writeFileSync('./movies.json', JSON.stringify(movies, null, 2));

    res.json(movie);
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});