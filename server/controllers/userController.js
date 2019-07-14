const User= require('../models/user')
const {generateToken}= require('../helpers/jwt')
const {compare}= require('../helpers/bcrypt')
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const sendEmail= require('../helpers/nodemailer')

class userController{

    static findAll(req, res, next){
        User.find({})
        .then(users =>{
            res.status(200).json(users)
        })
        .catch(next)
    }

    static register(req, res, next){
        let newUser= new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        })
        newUser.save()
        .then(user=>{
            let subject='Welcome to Trail Work'
            let textToSend = `
                    <h1> Welcome ${req.body.name} </h1>
                    <h3> Thank you for signing up for Trail Work!</h3>
                    <p> We really exited to help you manage your todo list project.</p>
                    <p> Checkout to our apps to get started. <span><a href="${process.env.CLIENT_URL}"> Get Started <a> </span></p><br>
                    <br><hr>
                    <h4>Sincerely, </h4>
                    <h4>Trail Work Team</h4>
                                           
                `
            sendEmail(req.body.email, subject, textToSend)
            res.status(201).json(user)
        })
        .catch(next)
    }

    static login(req, res, next){
            console.log('masuk login')
            User.findOne({email: req.body.email})
            .then(user=>{
                console.log(user)
                if(user){
                    if(compare(req.body.password, user.password)){
                        let payload= {
                            id: user._id,
                            email: user.email,
                            name: user.name
                        }
    
                        let token= generateToken(payload)
    
                        res.status(200).json({
                            token,
                            name: user.name,
                            userId: user._id
                        })
                    }else{
                        throw {code: 404, message: 'Wrong Email/Password'}
                    }
                }else{
                    throw {code: 404, message: 'Wrong Email/Password'}
                }
            })
            .catch(next)
    }

    static loginGoogle(req, res, next){
        client
        .verifyIdToken({
            idToken: req.body.idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        })

        .then(function(ticket){
            // console.log(ticket)
            const { email, name } = ticket.getPayload()

            let password= name+'fancytodo'
            // console.log(fullname,'fullname')
            let newUser= new User({
                name: name,
                email: email,
                password: password
            })

            User.findOne({email: email})
            .then(user=>{
                if(user){
                    console.log(user)
                    let payload= {
                        id: user._id,
                        email: user.email,
                        name: user.name
                    }

                    let token = generateToken(payload)
                    res.status(200).json({
                        token,
                        name: user.name,
                        userId: user._id
                    })

                }else{
                    User.create(newUser)
                    .then(user=>{
                        let payload= {
                            id: user._id,
                            email: user.email,
                            name: user.name
                        }
    

                        let token = generateToken(payload)

                        let subject='Welcome to Trail Work'
                        let textToSend = `
                                <h1> Welcome ${user.name} </h1>
                                <h3> Thank you for signing up for Trail Work!</h3>
                                <p> We really exited to help you manage your todo list project.</p>
                                <p> Checkout to our apps to get started. <span><a href="${process.env.CLIENT_URL}"> Get Started <a> </span></p><br>
                                <br><hr>
                                <h4>Sincerely, </h4>
                                <h4>Trail Work Team</h4>
                                                    
                            `
                        sendEmail(user.email, subject, textToSend)

                        res.status(200).json({
                            token,
                            name: user.name,
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

module.exports= userController