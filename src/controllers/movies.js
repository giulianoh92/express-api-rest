import { Movie } from '../models/movie.js';
import { validateMovie, validatePartialMovie } from '../schemas/movies.js';

export class MovieController {
    static async getAll(req, res) {
        const { genre } = req.query;
        const where = genre ? { genre } : {};
        const movies = await Movie.findAll({ where });
        res.json(movies);
    }

    static async getById(req, res) {
        const { id } = req.params;
        const movie = await Movie.findByPk(id);
        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }
        res.json(movie);
    }

    static async create(req, res) {
        if (!req.body) {
            return res.status(400).json({ message: 'Request body is required' });
        }
        const moviesArray = Array.isArray(req.body) ? req.body : [req.body];
        const newMovies = [];

        for (const movieData of moviesArray) {
            const result = validateMovie(movieData);

            if (result.error) {
                return res.status(422).json({ message: result.error.message });
            }

            const newMovie = await Movie.create(movieData);
            newMovies.push(newMovie);
        }

        res.status(201).json(newMovies);
    }

    static async update(req, res) {
        if (!req.body) {
            return res.status(400).json({ message: 'Request body is required' });
        }

        const { id } = req.params;
        const result = validatePartialMovie(req.body);

        if (result.error) {
            return res.status(422).json({ message: result.error.message });
        }

        const [updated] = await Movie.update(req.body, {
            where: { id }
        });

        if (!updated) {
            return res.status(404).json({ message: 'Movie not found' });
        }

        const updatedMovie = await Movie.findByPk(id);
        res.json(updatedMovie);
    }

    static async delete(req, res) {
        const { id } = req.params;
        const deleted = await Movie.destroy({
            where: { id }
        });

        if (!deleted) {
            return res.status(404).json({ message: 'Movie not found' });
        }

        res.status(204).send();
    }
}