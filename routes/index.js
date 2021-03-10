// ./routes/index.js
const movies = require('./movies')
const auth = require('./auth')
module.exports = app => {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  app.use('/api/movies', movies)
  app.use('/api/auth', auth)
  // Home page redirects to api documentation
  app.get('/', function(req, res){
    res.redirect('/api-docs/')
  })
}