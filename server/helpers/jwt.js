const jwt = require('jsonwebtoken')

module.exports = {
    generateToken: function(payload) {
        return jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn : '1h'
        })
    },
    verify: function(token){
        return jwt.verify(token, process.env.JWT_SECRET)
    }
}