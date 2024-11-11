import { writeFileSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const moviePath = path.join(__dirname, '../movies.json');
const movies = JSON.parse(readFileSync(moviePath, 'utf-8')); // cargar las películas desde el archivo JSON

export class MovieModel {
    static async getAll({ genre }) {
        if (genre) {
            return movies.filter(
                movie => movie.genre.toLowerCase() === genre.toLowerCase()
            );
        }
        return movies;
    }

    static async getById({ id }) {
        return movies.find(movie => movie.id === id);
    }

    static async create({ movieData }) {
        const newMovie = {
            id: randomUUID(),
            ...movieData
        };
        movies.push(newMovie);
        writeFileSync(moviePath, JSON.stringify(movies, null, 2));
        return newMovie;
    }

    static async update({ id, movieData }) {
        const movie = movies.find(movie => movie.id === id);
        if (!movie) {
            return null;
        }
        Object.assign(movie, movieData);
        writeFileSync(moviePath, JSON.stringify(movies, null, 2));
        return movie;
    }

    static async delete({ id }) {
        const movie = movies.find(movie => movie.id === id);
        if (!movie) {
            return null;
        }
        const index = movies.indexOf(movie);
        movies.splice(index, 1);
        writeFileSync(moviePath, JSON.stringify(movies, null, 2));
        return movie;
    }
}