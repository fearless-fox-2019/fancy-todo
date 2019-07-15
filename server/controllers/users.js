const User = require('../models/users')
const comparePassword = require('../helpers/comparePassword')
const getToken = require('../helpers/getToken')
const getPassword = require('../helpers/getPassword')
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
class ControllerUser {

  static findAll(req, res, next) {
    User.find()
    .then(result => {
      res.json(result)
    })
    .catch(next)
  }

  static create(req, res, next) {
    const { email, password } = req.body
    const input = { email, password }
    input.projects = []
    User.create(input)
    .then(result => {
      res.json(result)
    })
    .catch(next)
  }

  static findOne(req, res, next) {
    let {email} = req.params
    User.findOne({email: email})
    .then(result => {
      res.status(200).json(result)
    })
    .catch(next)
  }
  static login(req, res, next) {
    const { email, password } = req.body
    const input = { email, password }
    User.findOne({email: input.email})
    .then(user => {
      if(user){
        let check = comparePassword(user.password, input.password)
        if(check) {
          let payload = {
            _id: user._id,
            email: user.email,
            projects: user.projects
          }
          let token = getToken(payload)
          res.json({token, payload})
        } else {
          throw {status: 400, message: 'Wrong email / password'}
        }
      } else {
        throw {status: 400, message: 'Wrong email / password'}
      }
    })
    .catch(next)
  }

  static googleSignin(req, res, next) {
    let password
    let token
    client
      .verifyIdToken({
        idToken: req.body.id_token,
        audience: process.env.GOOGLE_CLIENT
      })
      .then(ticket => {
        const {email} = ticket.getPayload()
        password = getPassword(email)
        return User.findOne({email: email})
      })
      .then(result => {
        if(result) {
          let payload = {
            _id: result._id,
            email: result.email,
            projects: result.projects
          }
          token = getToken(payload)
          res.status(200).json({payload, token})
        } else {
          User.create({
            email: payload.email,
            password: password,
            projects: []
          })
          .then((result) => {
            let payload = {
              _id: result._id,
              email: result.email,
              projects: result.projects
            }
            res.status(200).json({payload, token})
          })
        }
      })
      .catch(next)
  }
}

module.exports = ControllerUser