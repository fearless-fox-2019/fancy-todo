if (process.env.NODE_ENV === 'development') {
  require('dotenv').config();
}
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { compareHash } = require('../helpers/bcrypt');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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
            id : found._id,
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

  static googleSignIn(req, res, next) {
    client.verifyIdToken({
      idToken: req.body.token,
      audience: process.env.GOOGLE_CLIENT_ID
    })
    .then((result) => {
      const {name, email, picture} = result.getPayload();
      const payload = {name, email, picture}
      return Promise.all([
        payload,
        User.findOne({
          email : payload.email
        })
      ])
    })
    .then((found) => {
      if (found[1] === null) {
        res.status(404).json(null)
      } else {
        console.log(found[0]);
        let token = jwt.sign({
          id : found[1]._id,
          name : found[1].fullname,
          username : found[1].username,
          email : found[0].email,
          picture : found[0].picture
        }, process.env.JWT_SECRET)
        res.status(200).json(token)
      }
    })
    .catch(next)

  }

  static getInfo(req, res, next) {
    User.findOne({
      email : req.decoded.email
    })
    .then((found) => {
      let data = {
        name : found.fullname,
        email : found.email,
        username : found.username,
        picture : req.decoded.picture
      }
      console.log(data);
      res.status(200).json(data)
    })
    .catch(next)
  }
}

module.exports = ControllerUser
