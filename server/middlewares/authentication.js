const {verify} = require('../helpers/jwt')
const User = require('../models/user')

module.exports = (req, res, next) => {
    console.log('masuk authenticate', req.headers);
    
    if(req.headers.hasOwnProperty('token')){
        try {
            const decoded = verify(req.headers.token)
            console.log(decoded,"ini dari aten");
            req.decoded = decoded
            next()
        } 
        catch (err) {
            res.status(400).json({
                message : `Bad Request`
            })
        }
    } else {
        res.status(403).json({
            message : `Forbidden Page`
        })
    }
}