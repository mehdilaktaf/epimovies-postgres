const { DataTypes } = require('sequelize');
const sequelize = require('../database/sequelize');
const User = require('./User')


/**
 * @swagger
 * definitions:
 *   MovieResponse:
 *     properties:
 *       id:
 *         type: integer
 *         description: The auto-generated id of the movie
 *         example: 1
 *       title:
 *         type: string
 *         description: The title of the movie
 *         example: Godzilla
 *       release_date:
 *         type: string
 *         format: date
 *         description: The release date of the movie
 *         example: March 10th, 2021
 *       description:
 *         type: string
 *         description: The description of the movie
 *         example: After defeating the MUTOs, the king of monsters is back...
 *       createdAt:
 *         type: string
 *         format: date
 *         description: Creation date of the movie
 *         example: 2021-03-10 12:00:00
 *       updatedAt:
 *         type: string
 *         format: date
 *         description: Last update date of the movie
 *         example: 2021-03-10 15:43:00
 *   MovieRequest:
 *     properties:
 *       title:
 *         type: string
 *         description: The title of the movie
 *         example: Godzilla
 *       release_date:
 *         type: string
 *         format: date
 *         description: The release date of the movie
 *         example: March 10th, 2021
 *       description:
 *         type: string
 *         description: The description of the movie
 *         example: After defeating the MUTOs, the king of monsters is back...
 *       createdAt:
 *         type: string
 *         format: date
 *         description: Creation date of the movie
 *         example: 2021-03-10 12:00:00
 *       updatedAt:
 *         type: string
 *         format: date
 *         description: Last update date of the movie
 *         example: 2021-03-10 15:43:00
 */
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