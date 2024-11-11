import express, { json } from 'express';
import cors from 'cors';
import { movieRouter } from './routes/movies.js'; // Importa el enrutador de películas
import { corsMiddleware } from './middlewares/cors.js';

const app = express(); // Instancia de Express
const port = process.env.PORT ?? 3000; // Puerto del servidor, por variable de entorno o 3000

app.use(json()); // Middleware para parsear el cuerpo de las solicitudes a JSON
app.use(corsMiddleware()); // Middleware de CORS
app.disable('x-powered-by'); // Deshabilita la cabecera X-Powered-By

app.use('/api', movieRouter); // Monta el enrutador de películas en la ruta /api

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});