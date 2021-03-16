const Router = require('express-promise-router')
const { authJwt } = require("../middleware");

const movie_controller = require("../controllers/movie.controller");
const rating_controller = require("../controllers/rating.controller");

// create a new express-promise-router
// this has the same API as the normal express router except
// it allows you to use async functions as route handlers
const router = new Router()
// export our router to be mounted by the parent application
module.exports = router

// --------------------------- ROUTES --------------------------- //

// ----# POST ROUTES #---- //

// create a movie
router.post(
    '/', 
    // Only signed in mods and admins can access this route
    [authJwt.verifyToken, authJwt.isModeratorOrAdmin],
    movie_controller.create
    );

// watch a movie 
router.post(
    '/:movieId', 
    // Any user signed in can access this route
    [authJwt.verifyToken],
    movie_controller.watch
    );

// create a rating for a movie
router.post(
    '/:movieId/ratings', 
    [authJwt.verifyToken],
    rating_controller.create
    );

// ----# PUT ROUTES #---- //

// update a movie
router.put(
    '/:movieId', 
    [authJwt.verifyToken, authJwt.isModeratorOrAdmin],
    movie_controller.update
    );

// update your own rating
router.put(
    '/:movieId/ratings', 
    [authJwt.verifyToken],
    rating_controller.update
    );
    
// update any rating
router.put(
    '/:movieId/ratings/:userId', 
    [authJwt.verifyToken, authJwt.isModeratorOrAdmin],
    rating_controller.updateAny
    );


// ----# GET ROUTES #---- //

/**
 * @swagger
 * /api/movies:
 *    get:
 *      tags:
 *        - Movie
 *      summary: Gets the list of all movies
 *      description: Returns a list of movie models
 *      produces:
 *          - application/json
 *      responses:
 *          200:
 *              description: An array of movie models
 *              schema:
 *                $ref: '#/definitions/MovieResponse'
 */
router.get(
    '/', 
    [authJwt.verifyToken],
    movie_controller.allMovies
    );

   
// get all ratings in db

/**
 * @swagger
 * /api/movies/ratings:
 *    get:
 *      tags:
 *        - Rating
 *      summary: Gets the list of all ratings 
 *      description: Returns a list of rating models
 *      produces:
 *          - application/json
 *      responses:
 *          200:
 *              description: An array of rating models
 *              schema:
 *                $ref: '#/definitions/RatingResponse'
 */
router.get(
    '/ratings', 
    [authJwt.verifyToken, authJwt.isModeratorOrAdmin],
    rating_controller.allRatings
    );


// get all user ratings in db

/**
 * @swagger
 * /api/movies/rated:
 *    get:
 *      tags:
 *        - Rating
 *      summary: Gets a list of current user ratings 
 *      description: Returns a list of rating models where userId = current user id
 *      produces:
 *          - application/json
 *      responses:
 *          200:
 *              description: An array of rating models
 *              schema:
 *                $ref: '#/definitions/RatingResponse'
 */
router.get(
    '/rated', 
    [authJwt.verifyToken],
    rating_controller.userRatings
    );


// get all seen movies

/**
 * @swagger
 * /api/movies/views:
 *    get:
 *      tags:
 *        - Movie
 *      summary: Gets the list of all viewed movies 
 *      description: Returns a list of movie models that have been viewed by at least one user
 *      produces:
 *          - application/json
 *      responses:
 *          200:
 *              description: An array of movie models
 *              schema:
 *                $ref: '#/definitions/MovieResponse'
 */
router.get(
    '/views', 
    [authJwt.verifyToken, authJwt.isModeratorOrAdmin],
    movie_controller.allSeenMovies
    );

// get all viewed movies

/**
 * @swagger
 * /api/movies/viewed:
 *    get:
 *      tags:
 *        - Movie
 *      summary: Gets the list of current user viewed movies 
 *      description: Returns a list of movie models that have been viewed by the current user
 *      produces:
 *          - application/json
 *      responses:
 *          200:
 *              description: An array of movie models
 *              schema:
 *                $ref: '#/definitions/MovieResponse'
 */
router.get(
    '/viewed', 
    [authJwt.verifyToken],
    movie_controller.userSeenMovies
    );

// get 10 most viewed movies

/**
 * @swagger
 * /api/movies/views/top:
 *    get:
 *      tags:
 *        - Movie
 *      summary: Gets the list of the 10 most viewed movies 
 *      description: Returns a list of movie models in decreasing order of views (limited to 10 movies)
 *      produces:
 *          - application/json
 *      responses:
 *          200:
 *              description: An array of movie models
 *              schema:
 *                $ref: '#/definitions/MovieResponse'
 */
router.get(
    '/views/top', 
    [authJwt.verifyToken],
    movie_controller.mostViewedMovies
    );

// get movies BY TITLE OR CATEGORY (LIKE)

/**
 * @swagger
 * /api/movies/search/{search_text}:
 *    get:
 *      tags:
 *        - Movie
 *      summary: Gets the list of movies filtered by search text
 *      description: Returns a list of movie models that have {search_text} in the title or category
 *      produces:
 *          - application/json
 *      responses:
 *          200:
 *              description: An array of movie models
 *              schema:
 *                $ref: '#/definitions/MovieResponse'
 */
router.get(
    '/search/:search_text', 
    [authJwt.verifyToken],
    movie_controller.moviesByTitleOrCategory
    );


// get a movie
/**
 * @swagger
 * /api/movies/{movieId}:
 *    get:
 *      tags:
 *        - Movie
 *      summary: Gets a movie by id
 *      description: Returns the movie with id={movieId} 
 *      produces:
 *          - application/json
 *      responses:
 *          200:
 *              description: A movie model
 *              schema:
 *                $ref: '#/definitions/MovieResponse'
 */
router.get(
    '/:movieId', 
    [authJwt.verifyToken],
    movie_controller.movieById
    );

// get all ratings for a movie
/**
 * @swagger
 * /api/movies/{movieId}/ratings:
 *    get:
 *      tags:
 *        - Rating
 *      summary: Gets a list of ratings associated to a movie
 *      description: Returns all the ratings of a movie by {movieId} 
 *      produces:
 *          - application/json
 *      responses:
 *          200:
 *              description: An array of rating models
 *              schema:
 *                $ref: '#/definitions/RatingResponse'
 */
router.get(
    '/:movieId/ratings', 
    [authJwt.verifyToken],
    rating_controller.ratingsByMovieId
    );

// get avg grade of a movie
/**
 * @swagger
 * /api/movies/{movieId}/avg_grade:
 *    get:
 *      tags:
 *        - Movie
 *      summary: Gets selected movie average grade
 *      description: Returns something
 *      produces:
 *          - application/json
 *      responses:
 *          200:
 *              description: Some type of response
 *              schema:
 *                
 */
router.get(
    '/:movieId/avg_grade', 
    [authJwt.verifyToken],
    rating_controller.avgGrade
    );
   
// get 10 most rated movies

/**
 * @swagger
 * /api/movies/ratings/top:
 *    get:
 *      tags:
 *        - Movie
 *      summary: Gets the list of the 10 best rated movies 
 *      description: Returns a list of movie models in decreasing order of grade (limited to 10 movies)
 *      produces:
 *          - application/json
 *      responses:
 *          200:
 *              description: An array of movie models
 *              schema:
 *                $ref: '#/definitions/MovieResponse'
 */
router.get(
    '/ratings/top', 
    [authJwt.verifyToken],
    rating_controller.topRatedMovies
    );
