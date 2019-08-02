const User = require('../models/users')
const {comparePassword} = require('../helpers/bcrpytPassword')
const {createToken} = require('../helpers/jwt')
const {verifyToken} = require('../helpers/jwt')
const {OAuth2Client} = require('google-auth-library');
const transporter = require('../helpers/nodeMailer')
const client = new OAuth2Client(process.env.CLIENT_ID);
const jwt = require('jsonwebtoken')

let payload

class UserController {
    static findAll() {
        User.findAll()
            .then((datas) => {
                res.status(200).json(datas)
            })
            .catch(next)
    }

    static create(req,res,next) {
        const {username,password,email}=req.body
        const input = {username,password,email}
        // console.log(input);
        User.create(input)
            .then((dataCreated) => {
                // console.log(dataCreated)
               jwt.sign(
                    {
                      data: dataCreated._id //foo:'bar' //data: data.dataValues.id
                    },
                    process.env.JWT_SECRET,
                    {
                      expiresIn: '1d',
                    },
                    (err, emailToken) => {
                      const url = `http://localhost:3000/api/users/confirmation/${emailToken}`;
                      transporter.sendMail({
                        to: req.body.email,
                        subject: 'Confirm Email',
                        html: `Please click this email to confirm your email: <a href="${url}">${url}</a>`,
                      },(err,resolve) => {
                          if(err) {
                              console.log(err)
                          } else {
                              console.log('email  sent')
                            res.status(201).json({dataCreated:dataCreated,token:emailToken})
                          }
                      });
                    },
                  );
                // console.log('object');
            })
            .catch(next)
    }

    static confirmEmail(req,res,next) {
        try {
            const user = verifyToken(req.params.token)
            // const user = jwt.verify(req.params.token, process.env.EMAILSECRET); //decoded.foo == bar // user.data
            // User.updateOne({ confirmed: true }, { where: { id: user.data } });
            User.findById(user.data)
                .then((dataFound) => {
                    if(dataFound) {
                        dataFound.confirmed = true
                        dataFound.save()
                    } else {
                        throw {status: 404, message: 'token is wrong/user not found'}
                    }
                })
        //   console.log('asd');
        } catch (e) {
            next()
        }
    }

    static login(req,res,next) {
        const {email,password} = req.body
        // console.log({username,password})
        User.findOne({email: email})
            .then((userFound) => {
                if(userFound) {
                    if(comparePassword(password,userFound.password)) {
                        // console.log(userFound)
                        let tokenJWT = createToken({username: userFound.username, email: userFound.email,_id: userFound._id}, process.env.JWT_SECRET)
                        res.status(201).json({token: tokenJWT, username: userFound.username, email: userFound.email})
                    } else {
                        throw {status:404, message: 'username/password salah'}
                    }
                } else {
                    throw {status: 404, message: 'username/password salah'}
                }
            })
            .catch(next)
    }

    static googleSignIn(req,res,next) {
        client.verifyIdToken({
            idToken: req.body.id_token,
            audience: process.env.CLIENT_ID  // Specify the CLIENT_ID of the app that accesses the backend
            // Or, if multiple clients access the backend:
            //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
        })
        .then((datas) => {
            payload = datas.getPayload();
            return User.findOne({email:payload.email})
        })
        .then((userFound) => {
            if(userFound) {
                // console.log(userFound)
                // let tokenJWT = createToken({username: userFound.username, email: userFound.email,_id: userFound._id}, process.env.JWT_SECRET)
                // res.status(200).json(tokenJWT)
                // next()

                return  userFound
            } else {
                return User.create({
                    email: payload.email,
                    username: payload.given_name+payload.family_name,
                    password: 12345
                })
            }
        })
        .then((dataCreated) => {
            // console.log(dataCreated)
            if(dataCreated) {
                // console.log(dataCreated)
                let tokenJWT = createToken({username: dataCreated.username, email: dataCreated.email,_id: userFound._id}, process.env.JWT_SECRET)
                res.status(201).json(tokenJWT)
            } else {
                next()
            }
        })
        .catch(next)
        // console.log(ticket)

    }


}

module.exports = UserController