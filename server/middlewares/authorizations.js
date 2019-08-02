const jwt = require('jsonwebtoken')
const Todo = require('../models/todo')
module.exports = (req, res, next) => {
    console.log('halo')
    Todo.findById(req.params.id)
        // res.json(req.params)
        .then(todo => {
            // res.json(user)
            console.log(todo)

            if (todo) {
                // console.log(req.user.id)
                // console.log(user.UserId)
                console.log(todo.user)
                for (let i = 0; i < todo.user.length; i++) {
                    console.log(todo.user[i])
                    console.log(req.headers.decoded._id)
                    if (todo.user[i] == req.headers.decoded._id) {
                        console.log('halo')
                        next()
                        break
                    } else {
                        next({ status: 403, message: 'not authorize' })
                    }
                }
            } else {
                next({ status: 403, message: 'not authorize' })
            }
        })
}