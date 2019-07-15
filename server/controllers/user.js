const User = require('../models/user')
const { compare } = require('../helpers/crypt')
const sign = require('../helpers/token')
const { OAuth2Client } = require('google-auth-library')
const client = new OAuth2Client(process.env.GOOGLE_API_KEY)

class Controller {

    static signup(req, res, next) {
        User.findOne({ email: req.body.email})
        .then( (user) => {
            if (user) {
                next({
                    code: 400,
                    message: 'Cannot registering same email twice'
                })
            } else {
                User.create({
                    email: req.body.email,
                    password: req.body.password,
                    todos: [],
                    projects: []
                })
                .then( (newUser) => {
                    res.status(201).json({
                        message: 'Successfully created',
                        info: newUser
                    })
                })
                .catch(next)
            }
        })
        .catch(next)
    }

    static signin(req, res, next) {
        User.findOne({ email: req.body.email })
        .then( (user) => {
            if (user) {
                console.log(user)
                console.log(req.body.password, user.password)
                console.log(compare(req.body.password, user.password))
                if (compare(req.body.password, user.password)) {
                    const token = sign({
                        userId: user._id,
                        email: user.email
                    })
                    res.status(200).json({
                        token: token,
                        email: user.email
                    })
                } else {
                    next({
                        code: 400,
                        message: 'Username / password not correct'
                    })
                }
            } else {
                next({
                    code: 400,
                    message: 'Username / password not correct'
                })
            }
        })
        .catch(next)
    }

    static googlesignin(req, res, next) {
        client.verifyIdToken({
                idToken: req.body.id_token,
                audience: process.env.GOOGLE_API_KEY
        })
        .then( (ticket) => {
            console.log(ticket.getPayload())
            const { email } = ticket.getPayload()
            let newUserInfo = { 
                email: email,
                password: 'fancytodo'
            }
            User.findOne({ email: email})
            .then( (user) => {
                if (user) {
                    let token = sign({
                        id: user._id,
                        email: user.email,
                    })
                    res.status(200).json({
                        token: token,
                        email: user.email
                    })
                } else {
                    User.create(newUserInfo)
                    .then( (newUser) => {
                        let token = sign({
                            id: newUser._id,
                            email: newUser.email,
                        })
                        res.status(200).json({
                            token: token,
                            email: newUser.email
                        })
                    })
                    .catch(next)
                }
            })
        })
        .catch(next)
    }

}

module.exports = Controller