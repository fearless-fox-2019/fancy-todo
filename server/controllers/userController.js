const User = require("../models/user")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const secret = process.env.SECRET
const {OAuth2Client} = require('google-auth-library');
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const client = new OAuth2Client(CLIENT_ID);

class UserController{
    static register(req, res, next) {        
        let newUser ={
            username : req.body.username,
            email: req.body.email,
            password: req.body.password
        }
        User.create(newUser)
        .then(user => {
            console.log("user registered")
            res.status(201).json(user)
            
        })
        .catch(next)
    }

    static login (req, res, next) {
        var userData = null
        User.findOne({email: req.body.email})
        .then(user =>{
            userData = user
            return bcrypt.compare(req.body.password, user.password)
        })
        .then(valid =>{
            if(valid) {
                const token = jwt.sign({_id: userData._id, username: userData.username, email: userData.email}, secret)
                res.status(200).json({token: token, username: userData.username})
                console.log("signed in")
            } else {
                throw ({
                    code: 400,
                    message: "Invalid username/password"
                })
            }
        })
        .catch(next)
    }

    static googleLogin(req,res,next){
        var payload = null
        client.verifyIdToken({
            idToken: req.body.idToken,
            audience: CLIENT_ID
        })
        .then(ticket =>{
            payload = ticket.getPayload()
            return User.findOne({email: payload.email})
        })
        .then(user =>{
            if(user){
                return user
            } else {
                var newuser = new User({
                    username: payload.name,
                    email: payload.email,
                    password: payload.jti
                })
                return newuser.save()
            }
        })
        .then(user =>{
            const token = jwt.sign({_id: user._id, username: user.username, email: user.email}, secret)
            res.status(200).json({token: token, username: user.username})
        })
        .catch(next)
    }



}

module.exports = UserController