const {User, Todo} = require('../models/index')
const {getToken} = require('../helpers/jwt')
const {comparePassword} = require('../helpers/bcrypt')
const {OAuth2Client} = require('google-auth-library')

class UserController{
    static create(req, res, next){
        const {username, email, password} = req.body
        const newData = {username, email, password}
        User.create(newData)
        .then(response => {
            res.status(200).json({
                message: 'success create !!', 
                data: response
            })
        })
        .catch(next)
    }
    static findAll(req, res, next){
        User.find()
        .then(response => {
            res.status(200).json({
                message: 'Success Get All data Users',
                data: response
            })
        })
        .catch(next)
    }
    static login(req, res, next){
        // email & password => jwt
        const {email, password} = req.body
        User.findOne({email: email})
        .then(data => {
            if(data){
                if(comparePassword(data.password, password)){
                    const forJwt = {
                        id: data._id,
                        email: data.email,
                        username: data.username
                    }
                    const token = getToken(forJwt)
                    res.status(200).json({
                        message: 'Valid',
                        data: {
                            name: data.username,
                            email: data.email
                        },
                        jwt: token
                    })
                }else{
                    next({
                        status: 400,
                        message: 'Username/Password Invalid'
                    })
                }
            }else{
                next({
                    status: 400,
                    message: 'Username/Password Invalid'
                })
            }
            // dataFind di client return Todo.findOne({UserId: ObjectID(data._id)})
            console.log(data)
        })
        .catch(next)
    }
    static loginGoogle(req, res, next){
        let userPayload
        const { id_token } = req.body
        console.log(id_token, ' -> ada id gasi -_-')
        const client = new OAuth2Client(process.env.GOOGLE_ACCESS_ID)
        client.verifyIdToken({
            idToken: id_token,
            audience: process.env.GOOGLE_ACCESS_ID
        })
        .then(ticket => {
            console.log('dari sini kayaknya')
            const payload = ticket.getPayload()
            return Promise.all([payload, User.findOne({
                email:  payload.email
            })])
        })
        .then(([payload, user]) => {
            console.log('masuk error disini')
            if (user) {
                return Promise.all([payload, user])
            } else {
                return Promise.all([payload, User.create({
                    username: payload.name,
                    email: payload.email,
                    password: 'indihaha'
                })])
            }
        })
        .then(([payload]) => {
            console.log(payload, 'masuk sini dulu')
            userPayload = payload
            return User.findOne({email: payload.email})
        })
        .then(userFind => {
            const forJwt = {
                id: userFind._id,
                email: userFind.email,
                username: userFind.username
            }
            const token = getToken(forJwt)
            res.status(200).json({
                message: 'Valid',
                data: {
                    name: userFind.username,
                    email: userFind.email
                },
                jwt: token
            })
        })
        .catch(next)
    }
}

module.exports = UserController