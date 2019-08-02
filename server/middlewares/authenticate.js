const jwt = require('jsonwebtoken')
const secret = process.env.SECRET

module.exports = (req, res, next) =>{
    console.log("tes")
    if(req.headers.token){
        var decoded = jwt.verify(req.headers.token, secret)
        if(decoded !== Error){
            req.headers.decoded = decoded
            next()
        }else{
            throw ({
                code: 400,
                message: "Invalid Token"
            })
        }
    }else{
        throw ({
            code: 401,
            message: "Login First"
        })
    }
}