const Role = require('../models/Role');
const User = require('../models/User');
const {secret, roles} = require('../settings');

// There are 2 main functions for Authentication:
// - signup: create new User in database (role is user if not specifying role)
// - signin:
//      * find username of the request in database, if it exists
//      * compare password with password in database using bcrypt, if it is correct
//      * generate a token using jsonwebtoken
//      * return user information & access Token

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  // Save User to Database
  User.create({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8)
  })
    .then(user => {
      if (req.body.role) {
        Role.findOne({
          where: {
            name: req.body.role
          }
        }).then(role => {
          user.setRole(role).then(() => {
            res.send({ message: "User was registered successfully!" });
          });
        });
      } else {
        Role.findOne({
          where: {
            name: 'user'
          }
        }).then(default_role => {
          user.setRole(default_role).then(() => {
              res.send({ message: "User was registered successfully!" });
          });
        });
      }
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.signin = (req, res) => {
  User.findOne({
    where: {
      username: req.body.username
    }
  })
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      var token = jwt.sign({ id: user.id }, secret, {
        expiresIn: 86400 // 24 hours
      });

      var authorities = [];
      user.getRole().then(role => {
        authorities.push("ROLE_" + role.name.toUpperCase());
        res.status(200).send({
          id: user.id,
          username: user.username,
          email: user.email,
          role: authorities,
          accessToken: token
        });
      });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};