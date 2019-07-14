const {User, Todo} = require('../models/index')
const {getToken} = require('../helpers/jwt')
const {comparePassword} = require('../helpers/bcrypt')
const {OAuth2Client} = require('google-auth-library')
const {MongoClient, ObjectID} = require('mongodb');

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
        const {username, password} = req.body
        let userData 
        User.findOne({username: username})
        .then(data => {
            userData = data
            return Todo.findOne({UserId: ObjectID(data._id)})
            console.log(data)
        })
        .then(todoFind => {
            if(data){
                if(comparePassword(userData.password, password)){
                    const forJwt = {
                        email: userData.email,
                        password: userData.password
                    }
                    const token = getToken(forJwt)
                    res.status(200).json({
                        message: 'Valid',
                        dataUser: userData,
                        dataTodo: todoFind,
                        jwt: token
                    })
                }else{
                    res.status(404).json({
                        message: 'Username/Password Invalid'
                    })
                }
            }else{
                res.status(404).json({
                    message: 'Username/Password Invalid'
                })
            }
        })
        .catch(next)
    }
    static loginGoogle(req, res, next){
        const { id_token } = req.body
        const client = new OAuth2Client(process.env.GOOGLE_ACCESS_ID)
        client.verifyIdToken({
            idToken: id_token,
            audience: process.env.GOOGLE_ACCESS_ID
        })
        .then(ticket => {
            const { email, name, picture } = ticket.getPayload()
            res.status(200).json({
                message: 'masuk dari server',
                data: name
            })
        })
        .catch(next)
    }
}

module.exports = UserController