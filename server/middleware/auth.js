const {
    sign,
    verify
} = require('../helpers/jwt')
const userModel = require('../models/userModel')

module.exports = {
    authentication: function (req, res, next) {
        let token = req.headers.token

        if (!token) {
            throw ({
                code: 400,
                message: `Unauthenticated`
            })
        } else {
            let decode = verify(token)
            userModel
                .findOne({
                    email: decode.email
                })
                .then((found) => {
                    let decode = verify(token)
                    req.decode = decode
                    req.logedUser = found
                    next()
                })
                .catch((err) => {
                    throw ({
                        code: 404,
                        message: `User not found`
                    })
                })
        }
    },
    authorization: function (req, res, next) {
        next()
    }
}