const Todo = require('../models/todo')
const User = require('../models/user')

class Controller {

    static fetchTodo(req, res, next) {
        Todo.find({ projectId: req.params.projectId, userId: req.params.userId})
        .populate('userId')
        .populate('projectId')
        .then( (todos) => {
            res.status(200).json(todos)
        })
        .catch(next)
    }

    static findOne(req, res, next) {
        Todo.find({projectId: req.params.projectId})
        .populate('userId')
        .populate('projectId')
        .then( (todo) => {
            if (todo) {
                res.status(200).json(todo)
            } else {
                next({
                    code: 404,
                    message: 'Todo not found'
                })
            }
        })
        .catch(next)
    }

    static searchTodo(req, res, next) {
        let searchedTodo = []
        if (req.query.todoName) {
            Todo.find()
            .then( (todos) => {
                for (var i=0; i<todos.length; i++) {
                    if (todos[i].name.search(req.query.todoName) !== -1) {
                        searchedTodo.push(todos[i])
                    }
                }
                if (searchedTodo.length > 0) {
                    res.status(200).json(searchedTodo)
                } else {
                    next({
                        code: 404,
                        message: `Todo with name ${req.query.todoName} not found`
                    })
                }
            })
            .catch(next)
        } else {
            next({
                code: 400,
                message: 'Search value required'
            })
        }
    }

    static addTodo(req, res, next) {
        Todo.create({
            projectId: req.params.projectId,
            userId: req.decoded.userId,
            name: req.body.name,
            description: req.body.description,
            due_date: new Date(req.body.due_date)
        })
        .then( (todo) => {
            res.status(201).json({
                message: 'Successfully created',
                info: todo
            })
        })
        .catch(next)
    }

    static deleteTodo(req, res, next) {
        Todo.findByIdAndRemove(req.params.todoId, (err, todo) => {
            if (err) {
                next(err)
            } else {
                const response = {
                    message: "Todo successfully deleted",
                    id: todo._id
                };
                res.status(200).json(response);
            }
        });
    }

    static editTodo(req, res, next) {
        const information = {}
        for (var key in req.body) {
            if (key === 'name' || key === 'description' || key === 'due_date' || key === 'status') {
                if (key === 'due_date') {
                    information[key] = new Date(req.body[key])
                } else if (key === 'status') {
                    if (req.body[key] == 'true') {
                        information[key] = true
                    } else if (req.body[key] == 'false') {
                        information[key] = false
                    }
                } else {
                    information[key] = req.body[key]
                }
            }
        }
        Todo.findByIdAndUpdate(
            req.params.todoId,
            information,
            {new: true},
            (err, todo) => {
                if (err) {
                    next(err)
                } else {
                    res.status(200).json(todo)
                }
            }
        )
    }
}

module.exports = Controller