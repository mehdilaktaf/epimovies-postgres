// ./routes/index.js
const movies = require('./movies')
const users = require('./users')
module.exports = app => {
  app.use('/movies', movies)
  app.use('/users', users)
}