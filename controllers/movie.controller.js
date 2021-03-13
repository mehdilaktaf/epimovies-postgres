const Movie = require('../models/Movie');
const User = require('../models/User');
const UserMovie = require('../models/UserMovie');
const { Op, Sequelize } = require("sequelize");

// There are many functions for Movies:
//  * create: create a new Movie in database 
//  * update: update a Movie in database
//  * allMovies: get all Movies in db (ordered by release_date)
//  * moviesById: get a Movies in db by its id
//  * moviesByTitleOrCategory: get Movies in db by title or category
//  * watch: add a Movie to UserMovies with currentUserId 
//  * allSeenMovies: get all see Movies in db (ordered by views)
//  * mostViewedMovies: get 10 most viewed Movies in db (ordered by views)


exports.create = (req, res) => {
  // Check if movie title already is in db 
  // Then add movie to db
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
              [Op.iLike]: '%' + req.params.search_text + '%' 
            } 
          },
          { 
            category: {
              [Op.iLike]: '%' + req.params.search_text + '%' 
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
  const movieIds = [];
  // NEW
  UserMovie.findAll({
    where: { UserId: req.userId}
  })
  .then(user_movies => {
    const selected_movie = user_movies.filter(movie => movie.MovieId == req.params.movieId)
    // If movie isnt already in the list, add it 
    if (selected_movie != []){
      User.findByPk(req.userId)
      .then(currentUser => {
        currentUser.addMovie(req.params.movieId); 
        movieIds.push(req.params.movieId);
        console.log(movieIds + req.params.movieId);

        user_movies.forEach(e => {
          movieIds.push(e.MovieId)
        });
        Movie.findAll({
          where: {
            id : { [Op.in]: movieIds}
          }
        })
        .then(seen_movies => {
          res.status(200).send(seen_movies);
        })
      })
    }    
  })
  .catch(err => {
    res.status(500).send({ message: err.message });
  });

  // OLD 
  // User.findOne({
  //   where: {
  //     id: req.userId,
  //     '$Movies.id$': req.params.movieId
  //   },
  //   include: {
  //     model: Movie
  //   }
  // })
  // .then(user=>{
  //   User.findByPk(req.userId)
  //   .then(currentUser => {
  //     if(user == null){
  //       currentUser.addMovie(req.params.movieId);    
  //       res.status(200).send(`You just watched a movie !`); 
  //     }
  //     else{
  //       // else give bad request code
  //       res.status(400).send({ message: `You have already seen '${user.Movies[0].title}' !` });
  //     }
  //   })
  // })
  // .catch(err => {
  //   res.status(500).send({ message: err.message })
  // });

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


exports.userSeenMovies = (req, res) => {
  UserMovie.findAll({
    where: { UserId: req.userId }
  })
  .then(user_movies => {
    const movieIds = [];
    user_movies.forEach(e => {
      movieIds.push(e.MovieId)
    });
    Movie.findAll({
      where: {
        id : { [Op.in]: movieIds}
      }
    })
    .then(seen_movies => {
      res.status(200).send(seen_movies);
    })
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

