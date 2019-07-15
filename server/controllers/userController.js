const User = require('../models/user')
const Helper = require('../helpers/helper')

class UserController {
    static signup(req, res, next) {
        let option = {
            username: req.body.username,
            password: req.body.password,
            email: req.body.email
        }
        User.create(option)
            .then((data) => {
                res.status(201).json(data)
            })
            .catch(next)
    }

    static signin(req, res, next) {
        User.findOne({
            email: req.body.email
        })
            .then(user => {
                if (user) {
                    if (Helper.comparePassword(req.body.password, user.password)) {
                        let payload = {
                            id: user._id,
                            username: user.username,
                            email: user.email
                        }
                        let genToken = Helper.generateJWT(payload)
                        res.status(200).json({
                            token: genToken,
                            data:payload
                        })
                    } else {
                        next({code: 404, message: 'invalid username/password'})
                    }
                } else {
                    next({code: 404, message: 'invalid username/password'})
                }
            })
            .catch(next)
    }

    static googleSignin(req, res, next) {
        
        let googleToken = req.body.token;
        // console.log(googleToken,'<=========');
        
        const { OAuth2Client } = require("google-auth-library");
        const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

        async function verify() {
          const ticket = await client.verifyIdToken({
            idToken: googleToken,
            audience: process.env.GOOGLE_CLIENT_ID 
          });
          const payload = ticket.getPayload();
          // console.log(payload, '=> payload')
          
          User.findOne({
              email : payload.email
          })
            .then((user) => {
                if(user){   
                    console.log('google go to signin')            
                    req.body = {
                        email : user.email,
                        password : user.email
                    }
    
                    User.findOne({
                      email: req.body.email
                    })
                      .then(user => {
                        if (!user) {
                            next({code: 404, message: 'invalid username/password'})
                        } else {
                          
                          if (Helper.comparePassword(req.body.password, user.password)) {
                            const payload = {
                              id: user.id,
                              username: user.username,
                              email : user.email
                            };
                            const token =  Helper.generateJWT(payload, process.env.JWT_SECRET);
                            console.log(token);
                            res.status(200).json({ access_token : token, username: payload.username });
                          } else {
                            next({code: 404, message: 'invalid username/password'})
                          }
                        }
                      })
                      .catch(next)
    
                    
                } else {
                    console.log('google go to signup')            
                    req.body = {
                        username : payload.name,
                        email : payload.email,
                        password : payload.email
                    }
                    const newuser = new User({
                      username: req.body.username,
                      password: req.body.password,
                      email : req.body.email
                    });
                    newuser
                      .save()
                      .then(user => {
                        console.log(user);
                        res.status(201).json(user);
                      })
                      .catch(err => {
                        console.log(err);
                        if(err.errors.email){
                            next({code: 400, message: err.errors.email.reason})
                        } else {
                            next(err)
                        }
                      });
                }
            })
            .catch(next)
        }
        verify().catch(next);
      }
    
}


module.exports = UserController