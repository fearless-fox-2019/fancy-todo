const User = require("../models/user");
const {OAuth2Client} = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_AUTH_KEY);
const jwt = require("../helpers/jwt");
const {compare} = require("../helpers/bcrypt");

class UserController{


    static signin(req, res, next){
        const input = req.body;
        console.log(req.body);
        User.findOne({email: input.email})
            .then((data) => {
                if(data){
                    if(compare(input.password, data.password)){
                        const payload = {
                            id: data._id,
                            email: data.email,
                            name: data.name
                        }
                        const token = jwt.sign(payload);
                        res.status(200).json({
                            token,
                            userId: data._id,
                            name: data.name
                        });
                    }else{
                        throw {code: 404, message: 'Wrong Email/Password'};
                    }
                }else{
                    throw {code: 404, message: 'Wrong Email/Password'};
                }
            })
            .catch(next);
    }

    static signup(req, res, next){
        User.create(req.body)
            .then((data) => {
                const payload = {
                    id: data._id,
                    email: data.email,
                    name: data.name
                }
                const token = jwt.sign(payload);
                res.status(200).json({
                    token,
                    userId: data._id,
                    name: data.name
                });
            })
            .catch(next)
    }

    static signinGoogle(req, res, next){
        let userData;
        client.verifyIdToken({
            idToken: req.body.idToken,
            audience: process.env.GOOGLE_AUTH_KEY
        })
            .then((LoginTicket) => {
                const {email, name, picture} = LoginTicket.getPayload();
                userData = {
                    name: name,
                    email: email,
                    picture: picture
                }

                return User.findOne({email: userData.email});
            })
            .then((data) => {
                if(data){
                    const payload = {
                        id: data._id,
                        email: data.email,
                        name: data.name
                    }
                    const token = jwt.sign(payload);
                    res.status(200).json({
                        token,
                        userId: data._id,
                        name: data.name
                    });

                    throw new Error("BREAK_PROMISE");
                }else{
                    userData["password"] = userData.name+"exectodo";
                    return User.create(userData)
                }
            })
            .then((data) => {
                const payload = {
                    id: data._id,
                    email: data.email,
                    name: data.name
                }
                const token = jwt.sign(payload);
                res.status(201).json({
                    token,
                    userId: data._id,
                    name: data.name
                });
            })
            .catch(next);
    }

}

module.exports = UserController;