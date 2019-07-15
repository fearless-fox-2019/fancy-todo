const {verify} = require('../helpers/jwt')
const {user} = require('../models/user')

function authentication(req, res, next){
    if(req.headers.hasOwnProperty('token')){
        let decode = verify (req.headers.token)
        req.decode = decode
        user.findOne({where : {email : req.decode.email }})
        .then((found) => {
            if(found){
                next()
            }else{
                res.status(403).json('Token does not match, Not Authenticated')
            }
        })
    }else{
        res.status(403).json('No token found, You have to register and login first')
    }
}

module.exports = authentication