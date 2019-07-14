const jwt = require('jsonwebtoken')
module.exports = function authenticate(req, res, next) {
    // console.log(req.headers)
    // console.log(process.env.SECRET)
    // console.log(923912386312361360931903912031239012312391203432498)
    if(req.headers.hasOwnProperty('token')){
        try {
            const decode = jwt.verify(req.headers.token, process.env.SECRET_JWT)
            req.decoded = decode
            next()
        }catch {
            next({status : 403, message : 'Invalid Token'})
        }
    }
    else {
        next({status : 400, message : 'You have to login first'})
    }
}