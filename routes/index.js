// ./routes/index.js
const movies = require('./movies')
const users = require('./users')
const auth = require('./auth')
module.exports = app => {
  app.use('/movies', movies)
  app.use('/users', users)
  app.use('/auth', auth)
}