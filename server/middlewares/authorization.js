const Todo = require('../models/todo')
const Project = require('../models/project')

function authorizationTodo(req, res, next) {
    Todo.findById(req.params.todoId)
    .populate('userId')
    .then( (todo) => {
        console.log(todo.projectId)
        if (todo) {
            if (todo.projectId) {
                Project.findOne({ 
                    _id: todo.projectId,
                    members: req.decoded.id
                })
                .then( (project) => {
                    if (project) {
                        next()
                    } else {
                        next({
                            code: 401,
                            message: 'You are not one of group member of project of this todo'
                        })
                    }
                })
                .catch(next)
            } else if (todo.userId === req.decoded.id) {
                next()
            } else {
                next({
                    code: 401,
                    message: 'You are not the author of this todo'
                })
            }
        } else {
            next({
                code: 404,
                message: 'Todo not found'
            })
        }
    })
}

function authorizationProject(req, res, next) {
    console.log(req.decoded.id)
    Project.findOne({
        _id: req.params.projectId, 
        admin: req.decoded.id
    })
    .then( (project) => {
        if (project) {
            next()
        } else {
            next({
                code: 401,
                message: 'You are not the author of this project'
            })
        }
    })
    .catch(next)
}

module.exports = { 
    authorizationTodo, 
    authorizationProject
}