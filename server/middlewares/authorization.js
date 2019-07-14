const Todo = require('../models/todo')
module.exports = function authorization(req, res, next) {
    // console.log(req.decoded, "==============")
    // console.log('ashiap masuk authorization')
    // console.log(req.decoded.id)
    Todo.findOne({ UserId : req.decoded.id })
    .then(data => {
        if(data){
            next()
        } else {
            next({status : 403, message : 'Unauthorized'})
        }
    })
    .catch(next)
}