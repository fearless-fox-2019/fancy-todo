const { OAuth2Client } = require('google-auth-library');
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const client = new OAuth2Client(CLIENT_ID);
const User = require("../models/user")
const jwt = require("jsonwebtoken")
const secret = process.env.SECRET
const bcrypt = require("bcryptjs")
const transporter = require('../helpers/nodemailer')
class UserController {
    static googleSignin(req, res, next) {
        var userToken = null
        var payload = null
        console.log(req.body.token)
        console.log(CLIENT_ID)
        client.verifyIdToken({
            idToken: req.body.token,
            audience: CLIENT_ID
        })
            .then(ticket => {
                payload = ticket.getPayload()
                return User.findOne({ email: payload.email })
            })
            .then(user => {
                console.log(payload.jti)
                if (user) {
                    console.log('bapak')
                    return user
                } else {
                    var newuser = new User({
                        username: payload.name,
                        email: payload.email,
                        password: payload.jti,
                        verify: false
                    })
                    return newuser.save()
                }
            })
            .then(user => {
                if(user.verify===false){
                    const token = jwt.sign({ _id: user._id, username: user.username, email: user.email }, secret, { expiresIn: "6h" },
                    (err, token) => {
                        const url = `
                      http://localhost:3000/api/users/confirmation/${token}`;
                        transporter.sendMail({
                            to: payload.email,
                            subject: 'Confirm Email',
                            html: `Please click this email to confirm your email: <a href="${url}">${url}</a>`,
                        }, (err, resolve) => {
                            if (err) {
                                console.log(err)
                            } else {
                                console.log('email sent')
                                userToken = token
                              
                            }
                        });
                        res.status(200).json({ access_token: token, username: user.username })
                    })
                
                }
                else{
                    const token = jwt.sign({ _id: user._id, username: user.username, email: user.email }, secret, { expiresIn: "6h" })
                    res.status(200).json({ access_token: token, username: user.username })
                }
               
            })
            .catch(next)
    }
    static confirmEmail(req, res) {
        console.log('halo')
        try {
            const user = jwt.verify(req.params.token, process.env.SECRET); //decoded.foo == bar // user.data
            console.log(user._id)
            User.updateOne({_id: user._id },{verify:true})
           res.status(200).json("your account now verified")
        } catch (e) {
           console.log(e)
        }
        // res.redirect('/user/login');;
    }
    static register(req, res, next) {
        var newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            verify: false
        })
        newUser.save()
            .then(user => {
                const token = jwt.sign({ _id: user._id, username: user.username, email: user.email }, secret, { expiresIn: "6h" },
                    (err, token) => {
                        const url = `
                http://localhost:3000/api/user/confirmation/${token}`;
                        transporter.sendMail({
                            to: req.body.email,
                            subject: 'Confirm Email',
                            html: `Please click this email to confirm your email: <a href="${url}">${url}</a>`,
                        }, (err, resolve) => {
                            if (err) {
                                console.log(err)
                            } else {
                                console.log('email sent')
                                res.status(200).json({ access_token: token, username: user.username })
                            }
                        });
                        res.status(200).json({ access_token: token, username: user.username })
                    })
            })
            .catch(next)
    }

    static login(req, res, next) {
        var userData = null
        User.findOne({ username: req.body.username })
            .then(user => {
                if (!user) {
                    throw ({
                        code: 400,
                        message: "Invalid username/password"
                    })
                }

                userData = user
                return bcrypt.compare(req.body.password, user.password)
            })
            .then(valid => {
                console.log(userData, "akudisini")
                if (valid) {
                    const token = jwt.sign({ _id: userData._id, username: userData.username, email: userData.email }, secret, { expiresIn: "6h" })
                    console.log(token,"woyy disini")
                    res.status(200).json({ access_token: token, username: userData.username })
                } else {
                    throw ({
                        code: 400,
                        message: "Invalid username/password"
                    })
                }
            })
            .catch(next)
    }
}

module.exports = UserController