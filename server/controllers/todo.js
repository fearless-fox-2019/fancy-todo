const {Todo} = require('../models')

class TodoController {

    static create(req, res) {
        console.log(req.headers, '<<<<<<<')
        const {title, description, due_date} = req.body
        let newTodo = {
            title,
            description,
            due_date,
            user_id: req.params.user_id
        }
        Todo.create(newTodo)
            .then(({email, username}) => {
                let payload = {
                    username,
                    email
                }
                res.status(201).json({message: 'succesfully create todo.'})
            })
            .catch(err => {
                res.status(500).json(err)
            })
    }
    static showAll(req, res) {
        Todo.find()
            .populate('user_id')
            .then(todos => {
                res.status(200).json(todos)
            })
            .catch(err => {
                res.status(500).json({
                    message: 'internal server error',
                    source: 'Todo Controller',
                    detail: err
                })
            })
    }
    static update(req, res) {
        const {id} = req.params
        const {status} = req.body
        Todo.updateOne({_id:id},{status})
            .then(success => {
                res.status(200).json({
                    message: 'success update todo.'
                })
            })
            .catch(err => {
                console.log(err)
                res.status(500).json({
                    message: 'internal server error',
                    source: 'Todo controller',
                    detail: err
                })
            })
    }

    static delete(req, res) {
        const {id} = req.params
        Todo.deleteOne({_id:id})
            .then(success => {
                res.status(200).json({
                    message: 'success delete todo.'
                })
            })
            .catch(err => {
                res.status(500).json({
                    message: 'internal server error',
                    source: 'Todo controller',
                    detail: err
                })
            })
    }

    static search(req, res) {
        Todo.find()
            .populate('user_id')
            .then(todos => {
                todos = todos.filter(todo => todo.title.includes(req.query.input) || todo.description.includes(req.query.input))
                // console.log(todos)
                res.status(200).json(todos)
            })
            .catch(err => {
                console.log(err)
                res.status(404).json({
                    message: 'Todo not found!'
                })
            })
    }

    static filter(req, res) {
        console.log(req.params)
        console.log(req.query)
    }

}

module.exports = TodoController