const jwt = require('jsonwebtoken')
const secret = process.env.DEFAULT_USER_SECRET
function authentication (req, res, next){
    if(req.headers.token){
        var decoded = jwt.verify(req.headers.token, secret)
        if(decoded !== Error){
            req.headers.decoded = decoded
            next()
        } 
        else{
            console.log('Invalid')
            res.status(400).json('Invalid Token')
        }
    }else{
        console.log('No')
        res.status(400).json({msg: 'No Token'})
    }
}