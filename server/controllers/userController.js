const User = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('../helpers/jwt')
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_KEY);

class UserController{
    static findByEmail(req,res,next){
        User.findOne({email: req.query.email})
        .then((data) => {
            res.status(200).json(data)
        })
        .catch(next)
    }

    static register(req,res,next){
        console.log(req.body);
        
        User.create({
            username:req.body.username,
            email:req.body.email,
            password:req.body.password
        })
        .then((newuser)=>{
            res.status(201).json(newuser)
        })
        .catch(next)
    }

    static login(req,res,next){
        console.log(req.body);
        
        User.findOne({email: req.body.email},function(err,user){
            if(err){
                throw err
            }else{
                if(user){
                    if (bcrypt.compareSync(req.body.password, user.password)) {
                        let obj = {
                            id: user._id,
                            email: user.email
                        }
                        res.json({token: jwt.sign(obj), username: user.username})
                        
                    } else {
                        res.status(400).json({
                            message: "wrong password"
                        })
                    }
                }else{
                    res.status(400).json({
                        message: "username wrong"
                    })
                }
            }
        })
    }

    static signInWithGoogle(req,res,next){
        let gooticket = ''
        client
            .verifyIdToken({
                idToken: req.body.id_token,
                audience: process.env.CLIENT_ID,
            })
            .then(function (ticket) {
                gooticket= ticket.getPayload()
                const { email } = ticket.getPayload();
                return User.findOne({ email: email })
            })
            .then((user) => {
                const {email, given_name} = gooticket
                
                if (user == null) {
                    console.log(email);
                    
                    return User.create({
                        username: given_name,
                        email: email,
                        password: `hacktiv${given_name}`
                    })
                } else {
                    return user
                    // console.log('ini',email);
                    // const accessToken = jwt.sign({ email })
                    // console.log(accessToken);
                    
                    // res.status(200).json({ token : accessToken, username: user.username })
                }
            })
            .then((data) => {
                console.log(data);
                
                const {email, given_name} = gooticket
                let obj = {
                    id: data._id,
                    email: email
                }
                const accessToken = jwt.sign(obj)
                res.status(201).json({token: accessToken, username: given_name})
            })
            .catch(next)
    }

}

module.exports = UserController