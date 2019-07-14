require('dotenv').config()
const jwt = require('jsonwebtoken')

module.exports = {
    signToken(payload) {
        return jwt.sign(payload, process.env.TODO_TOKEN_SECRET)
    },
    verifyToken(token) {
        return jwt.verify(token, process.env.TODO_TOKEN_SECRET)
    }
}