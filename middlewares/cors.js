import cors from 'cors'; // importar el paquete cors

const ACCEPTED_ORIGINS = [ // origenes permitidos
    'http://localhost:3000', 
    'http://localhost:8080', 
    'https://my-app.com'
];

export const corsMiddleware = ({ acceptedOrigins = ACCEPTED_ORIGINS } = {}) => cors({
    origin: (origin, callback) => {
        if (acceptedOrigins.includes(origin) || !origin) {
            return callback(null, true);
        }
        return callback(new Error('Origin not allowed by CORS'));
    }
}); // CORS Middleware