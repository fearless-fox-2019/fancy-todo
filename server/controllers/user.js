const { OAuth2Client } = require('google-auth-library')
    , client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

const User = require('../models/user')
    , jwt = require('jsonwebtoken')
    , bcryptjs = require('bcryptjs')

class userController {
    static signUp (req, res) {
        let { name, email, password } = req.body
            , user = { name, email, password } 
        User.create(user)
            .then( data => {
                res.status(201).json(data)
            })
            .catch( err => {
                res.status(500).json(err)
            })
    }

    static signIn (req, res) {
        let userData
        User.findOne({ email: req.body.email})
            .then( data => {
                if(data) {
                    userData = data
                    return bcryptjs.compare(req.body.password, data.password)
                } else {
                    throw new Error('Invalid username or password')
                }
            })
            .then( loggedIn => {
                if(loggedIn){
                    let token = jwt.sign({ name: userData.name, email:userData.email, password: userData.password}, process.env.DEFAULT_USER_SECRET, {expiresIn: '10h'})
                    res.status(200).json({access_token: token, username: userData.name})
                } else {
                    throw new Error('Invalid username or password')
                }
            })
            .catch( err => {
                res.status(500).json(err)
            })
    }

    static googleSignIn (req, res) {
        let payload
        client.verifyIdToken({
            idToken: req.body.idToken,
            audience: process.env.GOOGLE_CLIENT_ID
        })
        .then( ticket => {
            payload = ticket.getPayload()
            return User.findOne({ email: payload.email })
        })
        .then( user => {
            if(user) {
                return user
            } else {
                let newUser = new User({
                    name: payload.name,
                    email: payload.email,
                    password: payload.jti 
                })
                return newUser.save()
            }
        })
        .then( loggedIn => {
            if( loggedIn ){
                let token = jwt.sign(payload, process.env.DEFAULT_USER_SECRET)
                res.status(200).json({access_token: token, username: payload.name})
            } else {
                throw new Error('Invalid username or password')
            }
        })
    }
}

module.exports = userController