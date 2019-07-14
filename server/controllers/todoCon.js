const { decoded } = require('../helpers/jwt')
const Todo = require('../models/todo')

class TodoController {
    static list(req, res, next) {
        Todo.find()
        .then(data => {
            res.status(200).json(data)
        })
        .catch(next)
    }

    static searchById(req, res, next) {
        Todo.findById(req.params.id)
        .then(data => {
            if (!data) next({ message: 'Todo Not Found' })
                else res.status(200).json(data)
        }) 
        .catch(next)
    }

    static create(req, res, next) {
        let token = decoded(req.headers.access_token)
        let obj = {
            title: req.body.title,
            description: req.body.description,
            status: false,
            duedate: req.body.duedate,
            userId: token.id,
            projectId: req.body.projectId
        }
        Todo.create(obj)
        .then(data => {
            res.status(200).json(data)
        })
        .catch(next)
    }

    static update(req, res, next) {
        let obj = {
            title: req.body.title,
            description: req.body.description,
            status: req.body.status
        }
        Todo.findOne({_id : req.params.id})
        .then(data => {
            if (!data) next({ code: 404, resource: 'Todo' })
            else {
                data.set(obj)
                return data.save()                    
            }
        }) 
        .then(data =>{
            res.status(200).json(data)
        })
        .catch(next)
    }

    static delete(req, res, next) {
        Todo.findByIdAndDelete(req.params.id)
        .then(data => {
            if (!data) next({ code: 404, resource: 'Todo' })
                else res.status(200).json(req.params.id) 
        }) 
        .catch(next)
    }
    
}
module.exports = TodoController