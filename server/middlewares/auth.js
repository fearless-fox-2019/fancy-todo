const {verifyToken} = require('../helpers/jwt')
const {Todo} = require('../models')
module.exports = {
    authentication(req, res, next) {
        if (req.headers.hasOwnProperty('token')) {
            try {
                const decode = verifyToken(req.headers.token)
                req.decode = decode
                next()
            } catch(err) {
                console.log(err)
                res.status(403).json(err)
            }
        }else {
            res.status(403).json({
                message: 'Authentication failure'
            })
        }
    },
    authorization(req, res, next) {
        console.log(req.params)
        Todo.findById(req.params.todo_id)
            .populate('user_id')
            .then(todo => {
                if (todo.user_id._id == req.decode.id) {
                   next()
                }else {
                    throw new Error('unauthorized proccess.')
                }
            })
            .catch(err => {
                res.status(403).json({
                    message: 'forbidden process.',
                    detail: err.message
                })
            })
    }

}