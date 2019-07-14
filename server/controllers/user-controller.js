const User = require('../models/user')
const {
    OAuth2Client
} = require('google-auth-library')
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
const jwt = require('../helpers/jwt')
const bcrypt = require('bcryptjs')
const passwordGen = require('../helpers/generatePass')

const Todo = require('../models/todo')

class UserController {

    static loginPage(req, res,next) {
        res.status(200).json('Success get login page.')
    }

    static loginGoogle(req, res, next) {
        client.verifyIdToken({
                idToken: req.body.token,
                audience: process.env.GOOGLE_CLIENT_ID
            })
            .then(ticket => {
                let payload = ticket.getPayload()
                return Promise.all([payload, User.findOne({
                    email: payload.email
                })])
            })
            .then(([payload, user]) => {
                if (user) {
                    return Promise.all([payload, user])
                } else {
                    return Promise.all([payload, User.create({
                        name: payload.name,
                        email: payload.email,
                        password: passwordGen()
                    })])
                }
            })
            .then(([payload, user]) => {
                // console.log(user)
                payload.id = user._id
                let token = jwt.signToken(payload)
                res.status(200).json(token)
            })
            .catch(next)
    }

    static register(req, res, next) {
        // console.log(req.body)
        User.create({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            })
            .then(user => {
                res.status(201).json('Successfuly created an account.')
            })
            .catch(next)
    }

    static login(req, res, next) {
        User.findOne({
                email: req.body.email
            })
            .then(user => {
                if (user) {
                    console.log(user)
                    let payload = {
                        id: user._id,
                        name: user.name,
                        email: user.email
                    }

                    let check = bcrypt.compareSync(req.body.password, user.password)
                    if (check) {
                        let token = jwt.signToken(payload)
                        res.status(200).json({
                            token,
                            username: user.name
                        })
                    } else {
                        throw new Error('Wrong password')
                    }
                } else {
                    throw new Error('Email not found.')
                }
            })
            .catch(next)
    }

    static getTodo(req, res, next) {
        // console.log(req.headers.decode)
        User.findById(req.headers.decode.id)
            .populate('todos')
            .then(user => {
                // console.log(user, 'user <<<<<<<<<<<<<<<<<')
                res.status(200).json(user)
            })
            .catch(next)
    }

}

module.exports = UserController