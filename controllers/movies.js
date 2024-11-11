import { MovieModel } from '../models/movie.js';
import { validateMovie, validatePartialMovie } from '../schemas/movies.js';

export class MovieController {
    static async getAll (req, res) {
        const { genre } = req.query; // obtener el género de la consulta
        const movies = await MovieModel.getAll({ genre });
    
        res.json(movies); // retorna todas las películas si no se proporciona un género
    }

    static async getById (req, res) {
        const { id } = req.params;
        const movie = await MovieModel.getById({ id }); // buscar la película por ID
        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }
        res.json(movie);
    }

    static async create (req, res) { // ruta para crear una nueva película, o varias películas
        if (!req.body) {
            return res.status(400).json({ message: 'Request body is required' });
        }
        const moviesArray = Array.isArray(req.body) ? req.body : [req.body]; // manejar una solicitud de una sola película o varias películas
        const newMovies = [];
    
        for (const movieData of moviesArray) {
            const result = validateMovie(movieData); // validar los datos de la película
    
            if (result.error) {
                return res.status(422).json({ message: result.error.message });
            }
    
            const newMovie = await MovieModel.create({ movieData }); // crear una nueva película
            newMovies.push(newMovie);
        }
    
        res.status(201).json(newMovies);
    }

    static async update (req, res) {
        if (!req.body) {
            return res.status(400).json({ message: 'Request body is required' });
        }
    
        const { id } = req.params;
    
        const result = validatePartialMovie(req.body); // validar parcialmente los datos de la película
    
        if (result.error) {
            return res.status(422).json({ message: result.error.message });
        }
    
        const updatedMovie = await MovieModel.update({ id, movieData: req.body }); // actualizar la película
    
        if (!updatedMovie) {
            return res.status(404).json({ message: 'Movie not found' });
        }
    
        res.json(updatedMovie);
    }

    static async delete (req, res) {
        const { id } = req.params;
        const deletedMovie = await MovieModel.delete({ id }); // eliminar la película
    
        if (!deletedMovie) {
            return res.status(404).json({ message: 'Movie not found' });
        }
    
        res.json(deletedMovie);
    }
}