const Todo = require("../models/todo")
const { decoded } = require('../helpers/jwt')

class TodoController{
    static findAll(req, res, next) {
        Todo.find({
            userId: req.headers.decoded._id
        })
        .then(data => {
            res.status(200).json(data)
        })
        .catch(next)
    }

    static searchById(req, res, next) {
        Todo.findById(req.params.id)
        .then(data => {
            if (!data) res.status(404).json({ message: 'Not Found' })
                else res.status(200).json(data)
        }) 
        .catch(next)
    }

    static create(req, res, next) {
        let token = decoded(req.headers.token)
        let obj = {
            title: req.body.title,
            description: req.body.description,
            status: req.body.status,
            duedate: req.body.duedate,
            userId: token._id
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
            status: req.body.status,
            duedate: req.body.duedate
        }
        Todo.findOne({_id : req.params.id})
        .then(data => {
            if (!data) {
                res.status(404).json({ message: 'Not Found' })
            } else {
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
            if (!data) res.status(404).json({ message: 'Not Found' })
                else res.status(200).json(req.params.id)
        }) 
        .catch(next)
    }
}

module.exports = TodoController