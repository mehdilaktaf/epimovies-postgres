const Router = require('express-promise-router')
const { authJwt } = require("../middleware");

const controller = require("../controllers/movie.controller");

// create a new express-promise-router
// this has the same API as the normal express router except
// it allows you to use async functions as route handlers
const router = new Router()
// export our router to be mounted by the parent application
module.exports = router

// ROUTES //
// create a movie 
router.post(
    '/', 
    // Only signed in mods and admins cann access this route
    [authJwt.verifyToken, authJwt.isModeratorOrAdmin],
    controller.create
    )

// get all movies
router.get(
    '/', 
    [authJwt.verifyToken],
    controller.allMovies
    )

// get all seen movies
router.get(
    '/views', 
    [authJwt.verifyToken],
    controller.allSeenMovies
    )

// get 10 most viewed movies
router.get(
    '/views/top', 
    [authJwt.verifyToken],
    controller.mostViewedMovies
    )

// get movies BY TITLE
router.get(
    '/search/:search', 
    [authJwt.verifyToken],
    controller.moviesByTitleOrCategory
    )

// get a movie 
router.get(
    '/:movieId', 
    [authJwt.verifyToken],
    controller.movieById
    )

// update a movie
router.put(
    '/:movieId', 
    [authJwt.verifyToken, authJwt.isModeratorOrAdmin],
    controller.update
    )

// watch a movie 
router.post(
    '/:movieId', 
    [authJwt.verifyToken],
    controller.watch
    )

