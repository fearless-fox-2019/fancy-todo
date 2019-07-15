const Todo = require('../models/todo')
const User = require('../models/user')
const Helper = require('../helpers/helper')


class todoController {
    static create(req, res) {
        const decoded = Helper.verifyJWT(req.headers.token)

        User.findOne({
                email: decoded.email
            })
            .then(user => {
                return Todo.create({
                    title: req.body.title,
                    description: req.body.description,
                    due_date: req.body.due_date,
                    user_id: user._id
                })
            })
            .then((newTodo) => {
                res.status(201).json(newTodo)
            })
            .catch(err => {
                res.status(500).json(err)
            })
    }

    static getAllTodoByUser(req, res) {
        Todo.find({
                user_id: req.headers.id
            })
            .populate('user_id')
            .then(todoList => {

                res.status(200).json(todoList)
            })
            .catch(err => {
                res.status(500).json(err)
            })
    }

    static deleteTodo(req, res) {
        Todo
            .findOneAndDelete({
                _id: req.params.id
            })
            .then(todo => {
                if (todo) {
                    res.status(200).json({
                        message: 'todo successfully deleted'
                    })
                } else {
                    res.status(404).json({
                        message: 'todo not found'
                    })
                }
            })
            .catch(err => {
                res.status(500).json(err)
            })
    }

    static updateTodo(req, res) {
        Todo.
        findOneAndUpdate({
                _id: req.params.id
            }, {
                ...req.body
            }, {
                new: true
            })
            .then(todo => {
                if (todo) {
                    res.status(200).json(todo)
                } else {
                    res.status(404).json({
                        message: 'Todo not found'
                    })
                }
            })
            .catch(err => {
                
                res.status(500).json(err.message)
            })
    }





}

module.exports = todoController