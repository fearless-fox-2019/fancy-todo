const jwt = require("jsonwebtoken")
const secret = process.env.SECRET
module.exports = {
    authenticate(req,res,next){
        if(req.headers.token){
            try {
                var decoded = jwt.verify(req.headers.token, secret);
                req.headers.decoded = decoded

                console.log(decoded)
                next()
              } catch(err) {
                throw ({
                    code: 401,
                    message: "Please provide a valid token"
                })
              }
        }else{
            throw ({
                code: 401,
                message: "Not logged in"
            })
        }
    }
}