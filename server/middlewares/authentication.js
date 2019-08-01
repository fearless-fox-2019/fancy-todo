const {verify} = require('../helpers/jwt')
const user = require('../models/user')

function authentication(req, res, next){
    console.log('masuk ke authentication')
    // console.log(token)
    if(req.headers.hasOwnProperty('token')){
        let decode = verify (req.headers.token)
        req.decode = decode
        console.log(req.decode, 'ini reqqqqqqqqqqqqqqqqqqqq decode')
        console.log(req.decode.email,'ini decode email')
        user.findOne({email : req.decode.email })
        .then((found) => {
            if(found){
                console.log('authentication sukses')
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