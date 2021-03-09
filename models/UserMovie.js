const { DataTypes } = require('sequelize');
const sequelize = require('../database/db');
const User = require('./User')
const Movie = require('./Movie')

const UserMovie = sequelize.define('UserMovie', {
}, {
    //Other moddel options go here
    tableName: 'user_movies'
});

// Create UserMovie Table (many-to-many association)
Movie.belongsToMany(User, {through: 'UserMovie'});
User.belongsToMany(Movie, {through: 'UserMovie'});

(async () => {
    try {
        await UserMovie.sync()
        console.log(`Table '${UserMovie.tableName}' was created successfully or already existed.`);
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
})();

module.exports = UserMovie
