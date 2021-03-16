// const { UUID } = require('sequelize/types');
const mongoose = require('mongoose');
const mongo = require('../database/mongo')

/**
 * @swagger
 * definitions:
 *   RatingResponse:
 *     properties:
 *       id:
 *         type: ObjectId
 *         description: The auto-generated id of the rating
 *         example: 604fd881fe274d44046a49b2
 *       grade:
 *         type: integer
 *         description: The grade given to the movie by user (out of 100)
 *         example: 80
 *       rating_title:
 *         type: string
 *         description: The title of the rating
 *         example: Great movie !
 *       comment:
 *         type: string
 *         description: The description of the rating
 *         example: The soundtrack, the visual effects... EVERYTHING was GREAT !!!
 *       userId:
 *         type: integer
 *         description: The id of the user who wrote the rating
 *         example: 1
 *       movieId:
 *         type: integer
 *         description: The id of the movie the rating is associated to
 *         example: 32
 *       createdAt:
 *         type: string
 *         format: date
 *         description: The auto-generated creation date of the rating
 *         example: 2021-03-10 12:00:00
 *       updatedAt:
 *         type: string
 *         format: date
 *         description: The auto-generated last update date of the rating
 *         example: 2021-03-10 15:43:00
 *   RatingRequest:
 *     properties:
 *       grade:
 *         type: integer
 *         description: The grade given to the movie by user (out of 100)
 *         example: 80
 *       rating_title:
 *         type: string
 *         description: The title of the rating
 *         example: Great movie !
 *       comment:
 *         type: string
 *         description: The description of the rating
 *         example: The soundtrack, the visual effects... EVERYTHING was GREAT !!!
 *       userId:
 *         type: integer
 *         description: The id of the user who wrote the rating
 *         example: 1
 *       movieId:
 *         type: integer
 *         description: The id of the movie the rating is associated to
 *         example: 32
 */
const RatingSchema = new mongoose.Schema(
    {
        grade: { type: Number, required: true },
		rating_title: { type: String, required: true },
		comment: { type: String, required: true },
		userId: { type: Number, required: true },
		ratingId: { type: Number, required: true }
    },
    { 
        timestamps: true,
        collection: 'ratings' 
    }
);

const Rating = mongo.model('Rating', RatingSchema);

module.exports = Rating