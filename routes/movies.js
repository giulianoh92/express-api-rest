import { Router } from 'express';
import { writeFileSync, readFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { validateMovie, validatePartialMovie } from '../schemas/movies.js';

const movieRouter = Router();
const movies = JSON.parse(readFileSync('./movies.json', 'utf-8')); // Carga las películas desde el archivo JSON

movieRouter.get('/', (req, res) => {
    res.send('Hello World!');
});

movieRouter.get('/movies', (req, res) => {
    const { genre } = req.query; // Obtiene el género de los parametros de la solicitud
    if (genre) {
        const filteredMovies = filter(
            movie => movie.genre.toLowerCase() === genre.toLowerCase() // Si existe el género, filtra las películas por género
        );
        return res.json(filteredMovies);
    }
    res.json(movies); // Si no existe el género, devuelve todas las películas
});

movieRouter.get('/movies/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const movie = find(movie => movie.id === id); // Busca la película por ID

    if (!movie) {
        return res.status(404).json({ message: 'Movie not found' });
    }

    res.json(movie);
});

movieRouter.post('/movies', (req, res) => { // Ruta para crear una película, debe soportar la creación de una película o de un array de películas
    const moviesArray = Array.isArray(req.body) ? req.body : [req.body]; // Si el cuerpo de la solicitud es un array, lo asigna a moviesArray, si no, asigna el cuerpo de la solicitud a un array
    const newMovies = [];

    for (const movieData of moviesArray) {
        const result = validateMovie(movieData); // Valida los datos de la película

        if (result.error) {
            return res.status(422).json({ message: result.error.message });
        }

        const newMovie = { // Crea la nueva película
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
    const movie = find(movie => movie.id === id);

    if (!movie) {
        return res.status(404).json({ message: 'Movie not found' });
    }

    const result = validatePartialMovie(req.body); // Valida parcialmente los datos de la película

    if (result.error) {
        return res.status(422).json({ message: result.error.message });
    }

    Object.assign(movie, req.body); // Asigna los nuevos datos a la película

    writeFileSync('./movies.json', JSON.stringify(movies, null, 2)); // Actualiza los datos de la película en el archivo JSON

    res.json(movie);
});

export { movieRouter };