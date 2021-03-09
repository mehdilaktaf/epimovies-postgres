const Role = require('../models/Role');
const Movie = require('../models/Movie');
const User = require('../models/User');
const {secret} = require('../settings');
const { Op, Sequelize } = require("sequelize");
const UserMovie = require('../models/UserMovie');
const { sequelize } = require('../models/Role');

// There are many functions for Movies:
//  * create: create a new Movie in database 
//  * update: update a Movie in database
//  * allMovies: get all Movies in db (ordered by release_date)
//  * movieById: get a Movie in db by its id
//  * moviesByTitle: get all Movies in db by its title
//  * watch: add a Movie to UserMovies with currentUserId 
//  * allSeenMovies: get all see Movies in db (ordered by views)

exports.create = (req, res) => {
  Movie.create({
    title: req.body.title,
    release_date: req.body.release_date,
    description: req.body.description,
    category: req.body.category,
    img_url: req.body.img_url
  })
  .then(movie => {
      res.status(201).send({ message: "Movie was registered successfully!" });
  })
  .catch(err => {
    res.status(500).send({ message: err.message });
  });
};

exports.update = (req, res) => {

  var valid_fields = [];
  if(req.body.title)
    valid_fields.push('title');
  if(req.body.release_date)
    valid_fields.push('release_date');
  if(req.body.description)
    valid_fields.push('description');
  if(req.body.category)
    valid_fields.push('category');
  if(req.body.img_url)
    valid_fields.push('img_url');

  Movie.update(
    { 
      title: req.body.title,
      release_date: Date.parse(req.body.release_date),
      description: req.body.description,
      category: req.body.category,
      img_url: req.body.img_url
    },
    {
      where: {id: req.params.movieId} ,
      fields: valid_fields
    }
  )
  .then(function(rowsUpdated) {
    res.status(200).send({ message: "Movie was updated successfully!" });
  })
  .catch(err => {
    res.status(500).send({ message: err.message });
  });

};

exports.allMovies = (req, res) => {
  // Get all Movies in db (ordered by release_date)
  Movie.findAll({
    order: [
      ['release_date', 'DESC']
    ]
  })
  .then(movies => {
    res.status(200).send(movies);
  })
  .catch(err => {
    res.status(500).send({ message: err.message });
  });
};

exports.movieById = (req, res) => {
  Movie.findByPk(req.params.id)
    .then(movie => {
      res.status(200).send(movie);
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.moviesByTitleOrCategory = (req, res) => {
  Movie.findAll({
      where: {
        [Op.or]: [
          { 
            title: {
              [Op.iLike]: '%' + req.params.search + '%' 
            } 
          },
          { 
            category: {
              [Op.iLike]: '%' + req.params.search + '%' 
            }
          }
        ]        
      }
    })
    .then(movies => {
      res.status(200).send(movies);
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.watch = (req, res) => {
  User.findOne({
    where: {
      id: req.userId,
      '$Movies.id$': req.params.movieId
    },
    include: {
      model: Movie
    }
  })
  .then(user=>{
    User.findByPk(req.userId)
    .then(currentUser => {
      if(user == null){
        currentUser.addMovie(req.params.movieId);    
        res.status(200).send({ message: `You just watched '${user.Movies[0].title}'` }); 
      }
      else{
        // else give bad request code
        res.status(400).send({ message: `You have already seen '${user.Movies[0].title}' !` });
      }
    })
  })
  .catch(err => {
    res.status(500).send({ message: err.message })
  });

};



exports.allSeenMovies = (req, res) => {
  Movie.findAll({
    group: ["Movie.id"],
    includeIgnoreAttributes:false,
    include: [{
        model: User
    }],
    attributes: [
        "title",
        "release_date",
        "description",
        "category",
        "img_url",
        [Sequelize.fn("COUNT", Sequelize.col("Users.id")), "views"],
    ],
    order: [[Sequelize.literal("views"), "DESC"]]
  })
  .then(movies => {
    res.status(200).send(movies);
  })
  .catch(err => {
    res.status(500).send({ message: err.message });
  });

};


exports.mostViewedMovies = (req, res) => {
  Movie.findAll({
    group: ["Movie.id"],
    includeIgnoreAttributes:false,
    include: [{
        model: User
    }],
    attributes: [
        "title",
        "release_date",
        "description",
        "category",
        "img_url",
        [Sequelize.fn("COUNT", Sequelize.col("Users.id")), "views"],
    ],
    order: [[Sequelize.literal("views"), "DESC"]]
    
  })
  .then(movies => {
    movies.splice(10)
    res.status(200).send(movies);
  })
  .catch(err => {
    res.status(500).send({ message: err.message });
  });

};
