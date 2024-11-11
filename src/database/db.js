import 'dotenv/config';
import Sequelize from 'sequelize';

// Utiliza la URL de conexión de Heroku directamente
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    logging: false,  // Puedes activar esto para ver los logs de las consultas
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false,  // Esto es necesario para conectar a Heroku Postgres
        },
    },
});

export { sequelize };
