import { Router } from 'express';

import { DirectorController } from '../controllers/directors.js';

const directorRouter = Router();

directorRouter.get('/directors', DirectorController.getAll);

directorRouter.get('/directors/:id', DirectorController.getById);

directorRouter.post('/directors', DirectorController.create);

directorRouter.patch('/directors/:id', DirectorController.update);

directorRouter.delete('/directors/:id', DirectorController.delete);

export { directorRouter };