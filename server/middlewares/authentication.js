const jwt = require('jsonwebtoken')

function verify(req, res, next) {
    if (req.headers.hasOwnProperty('token')) {
        jwt.verify(req.headers.token, process.env.SECRET, (err, decoded) => {
            if (decoded) {
                req.decoded = decoded
                console.log(req.decoded)
                next()
            } else {
                console.log(err)
                next({
                    code: 401,
                    message: `${req.headers.token} is not a valid token`
                })
            }
        })
   } else {
        next({
            code: 401,
            message: `Access token required`
        })
   }
}

module.exports = verify