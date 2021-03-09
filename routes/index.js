// ./routes/index.js
const movies = require('./movies')
const ratings = require('./ratings')
const auth = require('./auth')
module.exports = app => {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  app.use('/movies', movies)
  app.use('/ratings', ratings)
  app.use('/auth', auth)
}