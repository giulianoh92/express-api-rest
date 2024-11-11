import cors from 'cors'; // Importa el paquete CORS



const ACCEPTED_ORIGINS = [ // Orígenes permitidos
    'http://localhost:3000', 
    'http://localhost:8080', 
    'https://my-app.com'
];

export const corsMiddleware = ({acceptedOrigins = ACCEPTED_ORIGINS } = {}) => cors({
    origin: (origin, callback) => {
        if (ACCEPTED_ORIGINS.includes(origin)) {
            return callback(null, true);
        }

        if (!origin) {
            return callback(null, true);
        }

        return callback(new Error('Not allowed by CORS'));
    }
}); // Middleware de CORS