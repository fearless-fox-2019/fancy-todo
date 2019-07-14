const userModel = require('../models/userModel')
const { compare } = require('../helpers/bcrypt')
const { sign } = require('../helpers/jwt')
const {
    OAuth2Client
} = require('google-auth-library');

class UserController {
    static userData(req,res,next) {
        let {_id, username, email, avatar} = req.logedUser
        let sent = {_id, username, email, avatar}

        res.json(sent)
    }
    static signUp(req, res, next) {
        console.log(req.body, '<== req.body')
        let {
            username,
            email,
            password
        } = req.body
        let newUser = {
            username,
            email,
            password,
            avatar: `https://api.adorable.io/avatars/213/${username}.png`
        }

        userModel
            .create(newUser)
            .then((created) => {
                console.log(created,'<== created')
                res.status(201).json(created)
            })
            .catch(next)
    }

    static signIn(req, res, next) {
        console.log(req.body,'<== ini loggin req body')
        let { username, password } = req.body

        userModel
            .findOne({
                username
            })
            .then((found)=> {
                if(found) {
                    if(compare(password, found.password)){
                        let payload = {
                            userId: found._id,
                            usernamame: found.username,
                            email: found.email
                        }
                        let token = sign(payload)
                        res.status(200).json({token})
                    }
                    else{
                        res.status(404).json({error: `Invalid username / password`})
                    }
                }
                else {
                    res.status(404).json({error: `Invalid username / password`})
                }
            })
            .catch(next)
    }

    static signGoogle(req, res, next) {
        console.log('sampaoi sini-=-=-=-')
        const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
        let myPayload
        client.verifyIdToken({
                idToken: req.body.idToken,
                audience: process.env.GOOGLE_CLIENT_ID
            })
            .then((ticket) => {
                console.log('pertama')
                let payload = ticket.getPayload()
                myPayload = {
                    email: payload.email,
                    name: payload.name,
                    family_name: payload.family_name,
                    given_name: payload.given_name,
                    picture: payload.given_name
                }

                return userModel
                            .findOne({
                                username : payload.name
                            })
            })
            .then((foundUser)=>{
                let token = sign(myPayload)
                console.log('kedua')
                if(foundUser){
                    console.log('ketigaa')
                    res.status(200).json({
                        message:'from server terdaftar',
                        token
                    })
                }
                else if( foundUser === null) {
                    console.log('keempoat')
                    let newUser = {
                        username: myPayload.name,
                        email: myPayload.email,
                        password: 123456
                    }
                    return userModel
                    .create(newUser)
                }
            })
            .then((second)=>{                
                console.log('kelima')
                let token = sign(myPayload)
                res.status(200).json({
                    message: `from server registered`,
                    token
                })
            })
            .catch(next)
    }
}

module.exports = UserController