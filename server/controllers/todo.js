const Todo = require('../models/todo')
    , { ObjectId } = require('mongoose')

class todoController {
    static create(req, res) {
        let { name, description, due_date } = req.body
            , todo = { name, description, due_date} 
        Todo.create(todo)
            .then( data => {
                res.status(201).json(data)
            })
            .catch( err => {
                res.status(500).json(err)
            })
    }

    static findAll(req, res) {
        Todo.find()
            .then( data => {
                res.status(200).json(data)
            })
            .catch( err => {
                res.status(500).json(err)
            })
    }

    static findById(req, res) {
        Todo.findById(req.params.todoId)
            .then( data => {
                res.status(200).json({
                    data: data
                })
            })
            .catch( err => {
                res.status(500).json(err)
            })
    }

    static deleteById(req, res) {
        Todo.findByIdAndDelete(req.params.todoId)
            .then( () => {
                res.status(200).json({
                    message: 'File has been deleted.'
                })
            })
            .catch( err => {
                res.status(500).json(err)
            })
    }

    static replace(req, res) {
        let { name, description, due_date } = req.body
            , todo = { name, description, due_date } 

        Todo.replaceOne({_id: req.params.todoId}, todo)
            .then( data => {
                res.status(200).json({
                    data
                })
            })
            .catch( err => {
                res.status(500).json(err)
            })
    }

    static update(req, res) {
        Todo.findByIdAndUpdate(req.params.todoId, { $set: req.body })
            .then( data => {
                res.status(200).json({
                    data
                })
            })
            .catch( err => {
                res.status(500).json(err)
            })
    }
}

module.exports = todoController