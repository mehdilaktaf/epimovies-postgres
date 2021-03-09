const jwt = require("jsonwebtoken");
const User = require('../models/User');
const {secret} = require('../settings');

// To process Authentication & Authorization, we have these functions:
// - check if token is provided, legal or not. 
//   We get token from x-access-token of HTTP headers, then use jsonwebtoken's verify() function.
// - check if roles of the user contains required role or not.

verifyToken = (req, res, next) => {
    let token = req.headers["x-access-token"];
  
    if (!token) {
      return res.status(403).send({
        message: "No token provided!"
      });
    }
  
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        return res.status(401).send({
          message: "Unauthorized!"
        });
      }
      req.userId = decoded.id;
      next();
    });
  };
  
  isAdmin = (req, res, next) => {
    User.findByPk(req.userId).then(user => {
      user.getRole().then(role => {
        if (role.name === "admin") {
          next();
          return;
        }
        res.status(403).send({
          message: "Require Admin Role!"
        });
        return;
      });
    });
  };
  
  isModerator = (req, res, next) => {
    User.findByPk(req.userId).then(user => {
      user.getRole().then(role => {
        if (role.name === "moderator") {
          next();
          return;
        }
        res.status(403).send({
        message: "Require Moderator Role!"
        });
      });
    });
  };
  
  isModeratorOrAdmin = (req, res, next) => {
    User.findByPk(req.userId).then(user => {
      user.getRole().then(role => {
        if (role.name === "moderator") {
          next();
          return;
        }
        if (role.name === "admin") {
          next();
          return;
        }
        res.status(403).send({
          message: "Require Moderator or Admin Role!"
        });
      });
    });
  };
  
  const authJwt = {
    verifyToken: verifyToken,
    isAdmin: isAdmin,
    isModerator: isModerator,
    isModeratorOrAdmin: isModeratorOrAdmin
  };
  module.exports = authJwt;