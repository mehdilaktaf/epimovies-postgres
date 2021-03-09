const { DataTypes } = require('sequelize');
const sequelize = require('../database/sequelize');
const User = require('./User')

const Movie = sequelize.define('Movie', {
    title: {
        type: DataTypes.STRING
    },
    release_date: {
        type: DataTypes.DATE
    },
    description: {
        type: DataTypes.STRING
    },
    category: {
        type: DataTypes.STRING
    },
    img_url: {
        type: DataTypes.STRING
    }
}, {
    //Other moddel options go here
    tableName: 'movies'
});


(async () => {
    try {
        await Movie.sync()
        console.log(`Table '${Movie.tableName}' was created successfully or already existed.`);
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
})();

module.exports = Movie