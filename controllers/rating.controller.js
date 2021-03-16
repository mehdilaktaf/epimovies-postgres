const Rating = require('../models/Rating');
const Movie = require('../models/Movie');
const User = require('../models/User');
const { Op, Sequelize } = require("sequelize");
const { movieById } = require('./movie.controller');

// There are many functions for ratings:
//  * create: create a new Rating in database 
//  * update: update one of your Rating in database (user)
//  * updateAny: update any Rating in database (admin and mod)
//  * allRatings: get all Ratings in db (ordered by release_date)
//  * ratingsByMovieId: get a Ratings in db by movie id
//  * avgGrade: get avg grade by movie id
//  * topRatedMovies: get 10 highest grade movies

exports.create = (req, res) => {
    // Check if user already rated this movie before creating rating
    Rating.findOne({userId: req.userId, movieId: req.params.movieId})
    .then(rating => {
        if(rating){
            res.status(400).send({ message: 'You already rated this movie !' });
        } else {
            Rating.create(
                {
                    grade: req.body.grade,
                    rating_title: req.body.rating_title,
                    comment: req.body.comment,
                    userId: req.userId,
                    movieId: req.params.movieId
                })
            .then(rating => {
            res.status(201).send(rating);
            })
        }
    })
    .catch(err => {
        res.status(500).send({ message: err.message });
    });
  };

  
exports.update = (req, res) => {

    var valid_fields = [];
    var update = {}
    // Filter non null fields 
    if(req.body.grade)
        valid_fields.push('grade');
    if(req.body.rating_title)
        valid_fields.push('rating_title');
    if(req.body.comment)
        valid_fields.push('comment');
    
    valid_fields.forEach(field => {
        update[field] = req.body[field];
    });

    Rating.findOneAndUpdate(
        {   
            userId: req.userId, 
            movieId: req.params.movieId
        },
        update,
        {
            new: true
        })
    .then(rating => {
        if(rating){
            res.status(200).send(rating);
        } else {
            res.status(404).send({ message: 'This movie rating does not exist !' });
        }
    })
    .catch(err => {
        res.status(500).send({ message: err.message });
    });
  };
  
  exports.updateAny = (req, res) => {

    var valid_fields = [];
    var update = {}
    // Filter non null fields 
    if(req.body.grade)
        valid_fields.push('grade');
    if(req.body.rating_title)
        valid_fields.push('rating_title');
    if(req.body.comment)
        valid_fields.push('comment');
    
    valid_fields.forEach(field => {
        update[field] = req.body[field];
    });

    // Check if movie rating exists then modify it
    Rating.findOneAndUpdate(
        {   
            userId: req.params.userId,
            movieId: req.params.movieId
        },
        update,
        {
            new: true
        })
    .then(rating => {
        if(rating){
            res.status(200).send(rating);
        } else {
            res.status(404).send({ message: 'This movie rating does not exist !' });
        }
    })
    .catch(err => {
        res.status(500).send({ message: err.message });
    });
  };

  exports.allRatings = (req, res) => {
    // Get all ratings written in db
    Rating.find()
    .then(ratings => {
        res.status(200).send(ratings);
    })
    .catch(err => {
        res.status(500).send({ message: err.message });
    });
  };

  
exports.userRatings = (req, res) => {
    // Get all ratings user wrote
    Rating.find({userId: req.userId})
    .then(ratings => {
        if(ratings){
            res.status(200).send(ratings);
        } else {
            res.status(404).send({ message: 'This movie rating does not exist !' });
        }
    })
    .catch(err => {
        res.status(500).send({ message: err.message });
    });
    };


exports.ratingsByMovieId = (req, res) => {
    // Get ratings of a movie
    Rating.find({
        movieId: parseInt(req.params.movieId)
    })
    .then(ratings => {
        if(ratings){
            res.status(200).send(ratings);
        } else {
            res.status(404).send({ message: 'This movie rating does not exist !' });
        }
    })
    .catch(err => {
        res.status(500).send({ message: err.message });
    });
  };

exports.avgGrade = (req, res) => {
    // Get average grade of a movie
    Rating.aggregate()
    .match({ movieId: parseInt(req.params.movieId)})
    .group({ _id: '$movieId', avg: {$avg: '$grade'}})
    .then(ratings => {
        if(ratings){
            res.status(200).send(ratings[0]);
        } else {
            res.status(404).send({ message: 'This movie rating does not exist !' });
        }
    })
    .catch(err => {
        res.status(500).send({ message: err.message });
    });
    };

exports.topRatedMovies = (req, res) => {
    // Get 10 top rated movies ids
    Rating.aggregate()
    .group({ _id: '$movieId', avg: { $avg: '$grade' } })
    .sort({ avg: -1})
    .limit(10)
    .then(ratings => {
        if(ratings){
            var movieIds = []
            ratings.forEach(element => {
                for (const [key, value] of Object.entries(element)) {
                    if(key == '_id')
                        movieIds.push(value)
                  }
            });
            Movie.findAll({
                where:{
                    id: {
                        [Op.in]: movieIds
                    }
                }
            })
            .then(movies => {
                // Sort back to movieIds order 
                var new_movies = []
                movieIds.forEach(movieId => {
                    movies.forEach(movie => { 
                        if(movieId == movie.id)
                            new_movies.push(movie)
                    })
                })
                res.status(200).send(new_movies);      
            })
        } else {
            res.status(404).send({ message: 'No ratings found !' });
        }
    })
    .catch(err => {
        res.status(500).send({ message: err.message });
    });
    };

    