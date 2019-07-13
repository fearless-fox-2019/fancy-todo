if (process.env.NODE_ENV === 'development') {
  require('dotenv').config();
}
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { compareHash } = require('../helpers/bcrypt');

class ControllerUser {

  static create(req, res, next) {
    User.create(req.body)
    .then((result) => {
      let token = jwt.sign({
        name : result.fullname,
        email : result.email
      }, process.env.JWT_SECRET)
      res.status(201).json(token)
    })
    .catch(next)
  }

  static signin(req, res, next) {
    User.findOne({
      email : req.body.email
    })
    .then((found) => {
      if (found === null) res.status(404).json({
        message : "Invalid Username or Password"
      }) 
      else {
        if (compareHash(req.body.password, found.password) === true) {
          let token = jwt.sign({
            name : found.fullname,
            username : found.username,
            email : found.email
          }, process.env.JWT_SECRET)
          res.status(200).json(token)
        } else {
          res.status(404).json({
            message : "Invalid Username or Password"
          }) 
        }
      }
    })
    .catch(next)
  }

  static getInfo(req, res, next) {
    console.log('getinfo');
    console.log(req.body);
    try {
      const decoded = jwt.verify(req.body.token, process.env.JWT_SECRET);
      res.status(200).json(decoded)
    } catch(err) {
      res.status(500).json(err)
    }
  }
}

module.exports = ControllerUser
