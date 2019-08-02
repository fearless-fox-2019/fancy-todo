const Todo = require('../models/todo')

module.exports = (req, res, next) => {
    Todo.findOne({
        UserId : req.decoded.id
    })
    .then(data => {
        if(data){
            if(data.UserId = req.decoded.id){
                next()
            } else {
                throw {
                    code : 401
                }
            }
        } else {
            throw {
                code : 404
            }
        }
    })
    .catch(next)
}