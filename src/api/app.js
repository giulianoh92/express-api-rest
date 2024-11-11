import express, { json } from 'express';
import { movieRouter } from '../routes/movies.js'; // Importa el enrutador de películas
import { corsMiddleware } from '../middlewares/cors.js';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Variables para manejar rutas relativas
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Instancia de Express
const app = express();

app.use(json()); // Middleware para parsear el cuerpo de las solicitudes a JSON
app.use(corsMiddleware()); // Middleware de CORS
app.disable('x-powered-by'); // Deshabilita la cabecera X-Powered-By

app.use('/api', movieRouter); // Monta el enrutador de películas en la ruta /api

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use(express.static(path.join(__dirname, '../public'))); // Middleware para servir archivos estáticos

export default app; // Exporta la instancia de Express como exportación por defecto