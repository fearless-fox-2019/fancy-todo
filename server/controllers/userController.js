const User = require('../models/user')
const comparePassword = require('../helpers/comparePassword')
const jwtToken = require('../helpers/jwtToken')
const {OAuth2Client} = require('google-auth-library')
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

class UserController {

    static register(req, res, next){
        let data = {
            name : req.body.name,
            email : req.body.email,
            password : req.body.password,
        }
        User.create(data)
        .then(data => {
            res.status(201).json(data)
        })
        .catch(next)
    }

    static login(req, res, next){
        let userData = {
            email : req.body.email,
            password : req.body.password
        }

        User.findOne({email : userData.email})
        .then(data => {
            if(!data){
                next({status : 404, message: 'email/password invalid'})
            }
            else{
                let check = comparePassword(userData.password, data.password)
                // console.log(data.password)
                console.log(check)
                if(check){                    
                    let token = jwtToken(data)
                    res.status(200).json({token})
                }
                else {
                    next({status : 404, message: 'email/password invalid'})
                }
            }
        })
        .catch(next)
    }

    static googleLogin(req, res, next){
        console.log('masuk google login')
        client.verifyIdToken({
            idToken : req.body.idToken,
            audience : process.env.GOOGLE_CLIENT_ID
        })
        .then(ticket => {
            const { email, name} = ticket.getPayload()
            let newUser = {
                name : name,
                email : email,
                password : process.env.PASSWORD_FOR_GOOGLE_ACCOUNT
            }
            User.findOne({email : email})
            .then(data => {
                console.log(data)
                if(data){
                    let payload = {
                        id : data._id,
                        email : data.email,                        
                    }
                    let token = jwtToken(payload)
                    res.status(200).json({ token, userId : data.id, name : data.name})
                }
                else{
                    User.create(newUser)
                    .then(data => {
                        let payload = {
                            id : data._id,
                            email : data.email,                        
                        }
                        let token = jwtToken(payload)

                        res.status(201).json({ token, userId : data.id, name : data.name })
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