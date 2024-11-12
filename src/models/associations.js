import { Movie } from './movie.js';
import { Person } from './person.js';

// Un Person tiene muchas Movies
Person.hasMany(Movie, {
    foreignKey: 'directorId'
});

// Una Movie pertenece a un Person
Movie.belongsTo(Person, {
    foreignKey: 'directorId'
});