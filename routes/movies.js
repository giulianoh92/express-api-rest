import { Router } from 'express';
import { writeFileSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';
import { validateMovie, validatePartialMovie } from '../schemas/movies.js';

const movieRouter = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const moviePath = path.join(__dirname, '../movies.json');
const movies = JSON.parse(readFileSync(moviePath, 'utf-8')); // cargar las películas desde el archivo JSON

movieRouter.get('/', (req, res) => {
    res.send('Hello World!');
});

movieRouter.get('/movies', (req, res) => {
    const { genre } = req.query; // obtener el género de la consulta
    if (genre) {
        const filteredMovies = movies.filter(
            movie => movie.genre.toLowerCase() === genre.toLowerCase() // filtrar las películas por género
        );
        return res.json(filteredMovies);
    }
    res.json(movies); // retorna todas las películas si no se proporciona un género
});

movieRouter.get('/movies/:id', (req, res) => {
    const id = req.params.id;
    const movie = movies.find(movie => movie.id === id); // buscar la película por ID

    if (!movie) {
        return res.status(404).json({ message: 'Movie not found' });
    }

    res.json(movie);
});

movieRouter.post('/movies', (req, res) => { // ruta para crear una nueva película, o varias películas
    const moviesArray = Array.isArray(req.body) ? req.body : [req.body]; // manejar una solicitud de una sola película o varias películas
    const newMovies = [];

    for (const movieData of moviesArray) {
        const result = validateMovie(movieData); // Validate movie data

        if (result.error) {
            return res.status(422).json({ message: result.error.message });
        }

        const newMovie = { // crear una nueva película con un ID único
            id: randomUUID(),
            ...movieData
        };

        movies.push(newMovie);
        newMovies.push(newMovie);
    }

    writeFileSync(moviePath, JSON.stringify(movies, null, 2));

    res.status(201).json(newMovies);
});

movieRouter.patch('/movies/:id', (req, res) => {
    const { id } = req.params;
    const movie = movies.find(movie => movie.id === id); // buscar la película por ID

    if (!movie) {
        return res.status(404).json({ message: 'Movie not found' });
    }

    const result = validatePartialMovie(req.body); // validar parcialmente los datos de la película

    if (result.error) {
        return res.status(422).json({ message: result.error.message });
    }

    Object.assign(movie, req.body); // actualizar la película con los datos nuevos
    writeFileSync(moviePath, JSON.stringify(movies, null, 2)); // guardar los cambios en el archivo JSON

    res.json(movie);
});

export { movieRouter };