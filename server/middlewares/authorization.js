const Todo = require('../models/Todo')

module.exports = {
    authorization (req, res, next){
        // console.log('masuk authorization berhasil body', req.body)
        Todo.findById(req.body.id)
        .then((todo)=>{
            if (todo.UserId == req.user.id){
                next()
            }
            else {
                throw {status: 400, message: "Unauthorized"}
            }
        })
        .catch(next)
    }
}