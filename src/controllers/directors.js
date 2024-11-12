import { Director } from '../models/director.js';
import { validateDirector, validatePartialDirector } from '../schemas/directors.js';

export class DirectorController {
    static async getAll(req, res) {
        const directors = await Director.findAll();
        res.json(directors);
    }

    static async getById(req, res) {
        const { id } = req.params;
        const director = await Director.findByPk(id);
        if (!director) {
            return res.status(404).json({ message: 'Director not found' });
        }
        res.json(director);
    }

    static async create(req, res) {
        if (!req.body) {
            return res.status(400).json({ message: 'Request body is required' });
        }
        const directorsArray = Array.isArray(req.body) ? req.body : [req.body];
        const newDirectors = [];

        for (const directorData of directorsArray) {
            const result = validateDirector(directorData);

            if (result.error) {
                return res.status(422).json({ message: result.error.message });
            }

            const newDirector = await Director.create(directorData);
            newDirectors.push(newDirector);
        }

        res.status(201).json(newDirectors);
    }

    static async update(req, res) {
        const { id } = req.params;
        const director = await Director.findByPk(id);
        if (!director) {
            return res.status(404).json({ message: 'Director not found' });
        }

        const result = validatePartialDirector(req.body);

        if (result.error) {
            return res.status(422).json({ message: result.error.message });
        }

        await director.update(req.body);
        res.json(director);
    }

    static async delete(req, res) {
        const { id } = req.params;
        const director = await Director.findByPk(id);
        if (!director) {
            return res.status(404).json({ message: 'Director not found' });
        }

        await director.destroy();
        res.json({ message: 'Director deleted' });
    }
}
