const { verifyToken } = require('../helpers/jwt')
const mongoose = require('mongoose')
const User = require('../models/users')

module.exports = function (req, res, next) {
    // console.log('asd')
    try {
        // console.log(localStorage.getItem('token'))
        // console.log(req.token)
        // console.log(req.headers['token'])
        let decoded = verifyToken(req.headers.token);
        // console.log(decoded)
        User.findById(decoded._id)
            .then(user => {
                if (user) {
                    // console.log(user)
                    req.decoded = decoded;
                    next()
                } else {
                    // console.log('asd')
                    throw { status: 401, message: 'Unauthorized' }
                }
            })
    } catch (error) {
        // console.log('asd')
        throw { status: 401, message: 'Unauthorized' }
    }
}