const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const User = require('../models/user')
const mailer = require('../helpers/mailer')
const generatePassword = require('../helpers/generatePassword')
const {sign} = require('../helpers/jwt')
const {comparePassword} = require('../helpers/bcrypt')

class UserController{
    static register(req, res, next){
        const {name, username, email, password} = req.body
        const newUser = {name, username, email, password}
        User.create(newUser)
        .then(data => {
            mailer(newUser)
            res.status(201).json({
                message : `Created new user`,
                data
            })
        })
        .catch(next)
    }

    static login(req, res, next){
        const {username, password} = req.body
        User.findOne({username})
        .then(found => {
            if(found){
                if(comparePassword(password, found.password)){
                    let user = {
                        id: found.id,
                        username : found.username,
                        name : found.name,
                        email : found.email,
                        password : found.password
                    }
                    
                    let token = sign(user)                    
                    res.status(200).json({
                        message : 'Success Login',
                        token : token
                    })
                } else {
                    throw {
                        code : 500,
                    }
                }
            } else {
                throw {
                    code : 404  
                }
            }
            
        })
        .catch(next)
    }

    static googleLogin(req, res, next){
        client.verifyIdToken({
            idToken : req.body.id_token,
            audience : process.env.GOOGLE_CLIENT_ID
        })
        .then(ticket => {
            const payload = ticket.getPayload()  
            User.findOne({
                email : payload.email
            })
            .then(result => {
                if(result){
                    const {id, username, name, email, password} = result
                    const found = {id, username, name, email, password}
                    const token = sign(found, process.env.JWT_SECRET)            
                    res.status(200).json({result, token})
                    
                } else {
                    const name = `${payload.given_name}${payload.family_name}`.toLowerCase()
                    const {email} = payload
                    const password = generatePassword()
                    const newUser = {name, email, password}

                    return User.create(newUser)
                    .then(result => {
                        let tokenNewUser = {
                            id: result._id,
                            username : result.username,
                            name : result.name,
                            email : result.email,
                            password : result.password
                        }
                        mailer(result)
                        const token = sign(tokenNewUser, process.env.JWT_SECRET)
                        
                        res.status(201).json({
                            message : `User Created`,
                            result,
                            token : token
                        })
                    })
                    .catch(next)
                }
            })
            .catch(next)
        })
        .catch(err => {
            console.log(err);
            
        })
    }
}

module.exports = UserController