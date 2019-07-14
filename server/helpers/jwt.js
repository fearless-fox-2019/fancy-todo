const jwt = require("jsonwebtoken")

module.exports = {
    sign(data) {
        return jwt.sign(data, process.env.SECRET)
        //payload {id, username} => token
    },
    decoded(token) {
        return jwt.verify(token, process.env.SECRET)
        //token => payload {id, username}
    }
}