const Todo = require('../models/todo')
class ControllerTodo {
    static create(req, res, next) {
        const {name,description,dueDate,category} = req.body 
        let input = {name,description,dueDate,category}
        console.log(req.headers.decoded)
        input.user = req.headers.decoded._id
        console.log(input)
        
        // res.send(input)
        Todo.create(input)
            .then((todo) => {
                res.status(201).json(todo)
            })
            .catch(next)
    }
    static get(req, res, next) {
        Todo.find({user:req.headers.decoded._id})
            .then((todos) => {
                res.status(200).json(todos)
            })
            .catch(next)
    }
    static getOne(req, res, next) {
        Todo.findById(req.params.id)
            .then((todo) => {
                res.status(200).json(todo)
            })
            .catch(next)
    }
    static destroy(req, res, next) {
        Todo.deleteOne({_id: req.params.id })
            .then((todo) => {
                res.status(200).json({
                    message: `berhasil terdelete pada id ${req.params.id}`
                })
            })
            .catch(next)
    }
    static update(req, res, next) {
        Todo.updateOne({_id: req.params.id },req.body,{ runValidators: true })
            .then((todo) => {
                res.status(200).json(todo)
            })
            .catch(next)
    }
    static updatePatch(req, res, next) {
        if((Object.values(req.body).length)<=1){
            Todo.update({_id: req.params.id },req.body)
            .then((user) => {
                res.status(200).json(user)
            })
            .catch(next)
        } else {
            res.json({message : 'only one can edit with patch'})
        }
        
    }
    static findByCategory(req, res, next) {
        let value = req.query.category
        console.log(req.query)
        Todo.find({category: value, user:req.headers.decoded._id})
            .then((data) => {
                // res.send(data)
                res.json(data)
            })
            .catch(next)
    }
    static findCategory(req, res, next) {
        let value = Object.values(req.query)
        console.log(req.query)
        Todo.find({user:req.headers.decoded._id}).distinct('category')
            .then((data) => {
                // res.send(data)
                res.json(data)
            })
            .catch(next)
    }
}
module.exports = ControllerTodo