import 'dotenv/config';
import app from './api/app.js';
import { sequelize } from './database/db.js';

const port = process.env.PORT ?? 3000;

async function main() {
    try {
        console.log('Connecting to the database...');
        await sequelize.authenticate({ logging: false });
        console.log('Connection has been established successfully.');

        // Sincroniza el modelo con la base de datos
        await sequelize.sync({ force: false });
        console.log('Database synchronized.');

        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

main();