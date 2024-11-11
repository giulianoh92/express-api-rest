import cors from 'cors'; // Import the CORS package

const ACCEPTED_ORIGINS = [ // Allowed origins
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