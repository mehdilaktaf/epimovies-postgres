// const { UUID } = require('sequelize/types');
const mongoose = require('mongoose');
const mongo = require('../database/mongo')

const RatingSchema = new mongoose.Schema(
    {
        grade: { type: Number, required: true },
		rating_title: { type: String, required: true },
		comment: { type: String, required: true },
		userId: { type: Number, required: true },
		movieId: { type: Number, required: true }
    },
    { 
        timestamps: true,
        collection: 'ratings' 
    }
);

const Rating = mongo.model('Rating', RatingSchema);

module.exports = Rating