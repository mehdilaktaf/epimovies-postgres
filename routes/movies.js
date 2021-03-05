const Router = require('express-promise-router')
const Movie = require('../models/Movie')

// create a new express-promise-router
// this has the same API as the normal express router except
// it allows you to use async functions as route handlers
const router = new Router()
// export our router to be mounted by the parent application
module.exports = router

// ROUTES //
// create a movie 
  
// get all movies

// get a movie 

// update a movie

// delete a movie (should only hide movie from users)

