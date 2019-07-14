const Todo = require('../models/todo')
const User = require('../models/user')

class TodoController {

    static create(req, res, next) {
        // console.log(req.headers)
        Todo.create({
                name: req.body.name,
                description: req.body.description,
                status: 'undone',
                due_date: req.body.due_date,
                UserId: req.headers.decode.id
            })
            .then(todo => {
                return Promise.all([todo, User.updateOne({
                    _id: req.headers.decode.id
                }, {
                    $push: {
                        todos: todo._id
                    }
                })])
            })
            .then(([todo]) => {
                res.status(200).json('Successfuly created a Todo')
            })
            .catch(next)
    }

    static update(req, res, next) {
        // console.log(req.params.todoId, 'TODO ID  <<<<<<<<<<<<<<<<<<<<<<<<<')
        Todo.updateOne({
                _id: req.params.todoId
            }, {
                $set: {
                    status: 'done'
                }
            })
            .then(updated => {
                // console.log(updated)
                res.status(200).json('Successfuly updated a Todo.')
            })
            .catch(next)
    }

    static delete(req, res, next) {
        Todo.deleteOne({
                _id: req.params.todoId
            })
            .then(deleted => {
                // console.log(deleted)
                return User.updateOne({
                    _id: req.headers.decode.id
                }, {
                    $pull: {
                        todos: req.params.todoId
                    }
                })

            })
            .then(updated => {
                res.status(200).json('Successfuly deleted a Todo.')
            })
            .catch(next)
    }

    static search(req, res, next) {
        // console.log(req.query)
        User.findById(req.headers.decode.id)
            .populate('todos')
            .then(user => {
                let todos = user.todos
                let searched = todos.filter(todo => {
                    let regex = new RegExp(`${req.query.name}`, 'i')
                    return regex.test(todo.name)
                })
                // console.log(searched)
                res.status(200).json(searched)
            })
            .catch(next)
    }

}

module.exports = TodoController