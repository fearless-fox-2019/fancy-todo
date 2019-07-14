const Todo = require('../models/todo')

module.exports = (req, res, next) => {
    Todo.findOne({
        UserId : req.decoded.id
    })
    .then(data => {
        console.log('masuk auth');
        
        if(data){
            console.log('ada data',data);
            
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