const User = require('../models/user')
const {compareHash} = require('../helpers/bcrypt')
const {generateToken} = require('../helpers/jwt')
const {OAuth2Client} = require('google-auth-library')
const {generatePassword} = require('../helpers/generatePassword')
class UserController {
    static register(req, res) {
        const {username, email, password} = req.body
        let newUser = {username, email, password}
        User.create(newUser)
            .then(user => {
                res.status(201).json({message: 'register completed.'})
            })
            .catch(err => {
                console.log(err.message)
                res.status(500).json({
                    message: 'Internal Server Error',
                    source: 'User controller',
                    detail: err.message
                })
            })
    }

    static login(req, res){
        const {email, password} = req.body
        User.findOne({email})
            .then(user => {
                if (!user) {
                    res.status(404).json({
                        message: 'invalid username / password.'
                    })
                }else {
                    if (compareHash(password, user.password)) {
                        let payload = {
                            id: user._id,
                            username: user.username,
                            email: user.email
                        }
                        let token = generateToken(payload)
                        res.status(200).json({token, payload})
                    }else {
                        res.status(404).json({
                            message: 'invalid username / password'
                        })
                    }
                }
            })
            .catch(err => {
                console.log(err)
                res.status(500).json({
                    message: 'internal server errror.',
                    source: 'User controller',
                    detail: err.message
                })
            })
    }

    static signinGoogle(req, res) {
        console.log('msuk sini')
        const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
        client.verifyIdToken({
            idToken: req.body.id_token,
            audience: process.env.GOOGLE_CLIENT_ID
        })
        .then(ticket => {
            const {name, email} = ticket.getPayload()
            let payload = {
                name,
                email
            }
            let token = generateToken(payload)
            let password = generatePassword(name)
            return Promise.all([User.findOne({email}),password, token, payload])
        })
        .then(([user, password, token, payload]) => {
            // console.log(user)
            if (user) {
                payload.id = user._id
                return Promise.all([token, payload])
            }else {
                payload.id = user._id
                console.log(payload,'<<<<<<<<<<<')
                const {name, email} = payload
                let newUser = {
                    username: name,
                    email: email,
                    password: password
                }
                return Promise.all([User.create(newUser), token, payload])
            }
        })
        .then(([token, payload]) => {
            res.status(200).json({token, payload})
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                message: 'internal server error.',
                source: 'User controller',
                detail: err.message
            })
        })
    }
}

module.exports = UserController