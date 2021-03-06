const Router = require('express-promise-router')
const { verifySignUp, authJwt } = require("../middleware");
const settings = require('../settings');
const controller = require("../controllers/user.controller");

// create a new express-promise-router
// this has the same API as the normal express router except
// it allows you to use async functions as route handlers
const router = new Router()
// export our router to be mounted by the parent application
module.exports = router

// ROUTES //
// create a user 
router.get(
    '/', 
    [authJwt.verifyToken],
    controller.userBoard
    )
  
// get all users

// get a user 

// update a user

// delete a user (should only hide user from users)

