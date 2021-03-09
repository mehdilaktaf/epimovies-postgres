const Router = require('express-promise-router')
const { authJwt } = require("../middleware");

const controller = require("../controllers/rating.controller");

// create a new express-promise-router
// this has the same API as the normal express router except
// it allows you to use async functions as route handlers
const router = new Router()
// export our router to be mounted by the parent application
module.exports = router

// ROUTES //
// create a rating 
router.post(
    '/:movieId', 
    // Only signed in mods and admins cann access this route
    [authJwt.verifyToken, authJwt.isModeratorOrAdmin],
    controller.create
    )

// update your own rating
router.put(
    '/:movieId', 
    // Only signed in mods and admins cann access this route
    [authJwt.verifyToken],
    controller.update
    )
    

// update any rating
router.put(
    '/:movieId', 
    // Only signed in mods and admins cann access this route
    [authJwt.verifyToken, authJwt.isModeratorOrAdmin],
    controller.updateAny
    )

// get ratings by movie id
router.get(
    '/:movieId', 
    [authJwt.verifyToken],
    controller.ratingsByMovieId
    )

// get all ratings
router.get(
    '/', 
    [authJwt.verifyToken],
    controller.allRatings
    )

// get avg grade of movie
router.get(
    '/:movieId/avg', 
    [authJwt.verifyToken],
    controller.avgGrade
    )
   
// get 10 most rated movies
router.get(
    '/:movieId/top', 
    [authJwt.verifyToken],
    controller.topRatedMovies
    )
   
