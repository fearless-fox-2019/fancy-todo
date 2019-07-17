const User = require('../models/User')
const {compare} = require('../helpers/bcrypt')
const {generateToken} = require('../helpers/jwt')
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

class UserController {
    static getAll(req, res, next){
        console.log('masuk controller get all user')
        console.log('ini req.body', req.body.UserId)
        User.find({
            _id : {$nin: [`${req.body.UserId}`] }
        })
            .then((allUser)=>{
                res.status(200).json(allUser)
            })
            .catch(next)
    }


    static register (req, res, next){
        console.log('masuk register')
        User.create(req.body)
            .then((user)=>{
                res.status(201).json(user)
            })
            .catch(next)
    }

    static login (req, res, next){
        console.log('masuk login normal')
        User.findOne({email : req.body.email})
            .then((user)=>{
                if (user){
                    if (compare(req.body.password,user.password)){
                        let payload = {
                            id : user._id,
                            name : user.name,
                            email : user.email
                        }
                        
                        let token = generateToken(payload)
                        res.status(200).json({
                            token,
                            userId : user._id,
                            name : user.name,
                            email: user.email
                        })
                    }
                    else {
                        throw {code: 404, message: 'Wrong Email/Password'}
                    }
                }
                else {
                    throw {code: 404, message: 'Wrong Email/Password'}
                }
            })
            .catch(next)
    }

    static loginGoogle (req, res, next){
        console.log('masuk login google')
        client.verifyIdToken({
            idToken: req.body.idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        })
        .then((ticket)=>{
            const {email, name} = ticket.getPayload()
            
            let password = name+'fancyTodo'
            let newUser = new User ({
                name : name,
                password : password,
                email : email
            })
            User.findOne ({email : email})
            .then((user)=>{
                if (user){
                    let payload = {
                        id : user._id,
                        name : user.name,
                        email : user.email
                    }

                    let token = generateToken(payload)

                    res.status(200).json({
                        token: token,
                        userId: user._id,
                        name: user.name,
                        email: user.email
                    })
                }
                else {
                    User.create(newUser)
                    .then((user)=>{
                        let payload = {
                            id: user._id,
                            name: user.name,
                            email: user.email
                        }

                        let token = generateToken(payload)

                        res.status(201).json({
                            token: token,
                            id: user._id,
                            name: user.name,
                            email: user.email,
                            userId: user._id
                        })
                    })
                    .catch(next)
                }
            })
            .catch(next)
        })
        .catch(next)
    }
}

module.exports = UserController
