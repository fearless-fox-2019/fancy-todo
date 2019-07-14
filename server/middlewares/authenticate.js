const jwt = require('jsonwebtoken')
const secret = process.env.SECRET

module.exports = (req, res, next) =>{
    if(req.headers.token){
        try {
            var decoded = jwt.verify(req.headers.token, secret);
            req.headers.decoded = decoded
            next()
          } catch(err) {
            throw ({
                code: 401,
                message: "Invalid Token, Please Login"
            })
          }
    }else{
        throw ({
            code: 401,
            message: "Login First"
        })
    }
}