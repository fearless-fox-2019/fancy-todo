const { OAuth2Client } = require('google-auth-library')
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const { sign } = require('../helpers/jwt')
const User = require('../models/user')

class googleSignInController{
    static loginFromGoogle(req, res, next){
        console.log('login dari google')
        const token = req.body.idToken
        console.log(token, 'ini token anda')
        client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID
        })
        .then((ticket) => {
            console.log(ticket, 'INI TICKETTTTTTTTTTTTTTTTTTTTTTTT')
            const { name, email, picture } = ticket.getPayload()
            // const a =  { name, email, picture }
            return User.findOne({email})
            .then((found) => {
                if(found){
                    // console.log('email found')
                    console.log(found, "ini hasil found");
                    let foundUser = {
                        id : found._id,
                        name : found.name,
                        email : found.email,
                        picture
                    }
                    const tokenJWT = sign(foundUser)
                    res.status(200).json({
                        token: tokenJWT,
                        email,
                        name
                    })
                }else{
                    // console.log('email not found')
                    let password = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
                    console.log(password)
                    return User.create({name, email, password})
                    .then((newUser) => {
                        const tokenJWT = sign({ name ,email, picture })
                        res.status(200).json({
                            token: tokenJWT,
                            email,
                            name,
                            picture
                        })  
                    })
                }
            })
        })
        .catch(next)
    }
}

module.exports = googleSignInController