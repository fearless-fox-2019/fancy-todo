const user = require('../models/user')
const {decrypt} = require('../helpers/bcrypt')
const {sign} = require('../helpers/jwt')


class userController{

    static register (req, res, next){
        console.log('masuk ke register server')
        const newUser = {
            name : req.body.name,
            email : req.body.email,
            password : req.body.password,
        }
        user.create(newUser)
        .then((created) => {
            res.status(201).json(newUser)
        })
        .catch(next)
    }

    static login(req, res, next){
        let datalogin = {
            email : req.body.email,
            password : req.body.password
        }
        User.findOne({ email : datalogin.email })
        .then(emailMatch => {
            if(!emailMatch){
                res.status(404).json('email not found')
            }else{
                let checkPassword = decrypt(datalogin.password, emailMatch.password)
                if(checkPassword){
                    let payload = {
                        id : emailMatch.id,
                        name: emailMatch.name,
                        email : emailMatch.email
                    }
                    let credentials = sign(payload)
                    res.status(200).json({token : credentials, email : payload.email, id : payload.id})
                }else{
                    res.status(404).json('Invalid email or Password')
                }
                res.json(emailMatch)
            }
        })
        .catch(next)
    }
}

module.exports = userController