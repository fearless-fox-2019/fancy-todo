const jwtoken = require('../helpers/jwt')
const Todo = require('../models/todo')

module.exports = {
    authentication(req, res, next) {
        // console.log(req.headers.token,'AUTHENTICATION <<<<<<<<<<<<<')
        try {
            var decoded = jwtoken.verifyToken(req.headers.token)
            req.headers.decode = decoded
            next()
        } catch (err) {
            throw new Error(`Invalid token.`)
        }
    },
    authorization(req, res, next) {
        // console.log(req.params, 'AUTHORIZATION <<<<<<<<<<<<<<<<<<<<')
        Todo.findById(req.params.todoId)
            .then(todo => {
                if (todo.UserId == req.headers.decode.id) {
                    next()
                } else {
                    throw new Error(`Unauthorized process.`)
                }
            })
    }
}