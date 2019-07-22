const jwt = require('../helpers/jwt')
const User = require('../models/user')
const Todo = require('../models/todo')

module.exports = {
  Authentication(req, res, next) {
    if (req.headers.hasOwnProperty('access_token')) {
        req.decoded = jwt.decoded(req.headers.access_token)
        User.findOne({ email: req.decoded.email })
        .then(data => {
            if (!data) {
                next ({status: 404, message: "email not found"})
            } else {
                next()
            }
        })
        .catch(next)
    } else {
        next({status: 403, message: "Forbidden page"})
    }
  },
  Authorization(req, res, next){
    let decodeToken = jwt.decoded(req.headers.access_token)
    Todo.findById(req.params.id)    
    .then((gotData)=>{
        if(gotData){
            if(gotData.userId == decodeToken.id){
                next()
            } else {
                next ({code : 401, message : "Unauthorized"})
            }
        } else {
        }
    })
    .catch(next)
}  
} 