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
    [authJwt.verifyToken, authJwt.isModeratorOrAdmin],
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
    '/:movieId/ratings', 
    // Only signed in mods and admins cann access this route
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
 *      summary: Gets a list of movie models
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

// get all seen movies
router.get(
    '/views', 
    [authJwt.verifyToken],
    movie_controller.allSeenMovies
    );

// get 10 most viewed movies
router.get(
    '/views/top', 
    [authJwt.verifyToken],
    movie_controller.mostViewedMovies
    );

// get movies BY TITLE OR CATEGORY (LIKE)
router.get(
    '/search/:search_text', 
    [authJwt.verifyToken],
    movie_controller.moviesByTitleOrCategory
    );

// get a movie 
router.get(
    '/:movieId', 
    [authJwt.verifyToken],
    movie_controller.movieById
    );

// get all ratings for a movie
router.get(
    '/:movieId/ratings', 
    [authJwt.verifyToken],
    rating_controller.ratingsByMovieId
    );

// get all ratings in db
router.get(
    '/ratings', 
    [authJwt.verifyToken, authJwt.isModeratorOrAdmin],
    rating_controller.allRatings
    );

// get avg grade of a movie
router.get(
    '/:movieId/avg_grade', 
    [authJwt.verifyToken],
    rating_controller.avgGrade
    );
   
// get 10 most rated movies
router.get(
    '/:movieId/ratings/top', 
    [authJwt.verifyToken],
    rating_controller.topRatedMovies
    );
   
