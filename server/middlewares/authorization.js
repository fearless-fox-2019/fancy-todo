const Todo = require('../models/todo')
const Project = require('../models/project')

function authorizationIndividu(req, res, next) {
    Todo.findById(req.params.todoid)
        .then((data) => {
            if (data.user_id == req.decoded.id) {
                next()
            }else{
                throw ({
                    code: 401,
                    message: "Unauthorized"
                })
            }
        })
        .catch(next)
}

function authorizationProject(req,res,next){
    Project.findById(req.params.id)
    .then((data)=>{
        if(data.user_id == req.decoded.id){
            next()
        }else{
            throw({
                code: 401,
                message: "Unauthorized"
            })
        }
    })
    .catch(next)
}


module.exports = { authorizationIndividu, authorizationProject }