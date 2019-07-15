const todo = require('../models/todo')
const user = require('../models/user')

class todoController{

    static createTodo(req, res, next){
        console.log(req.decode.id)
        const newTodo = {
            title : req.body.title,
            description : req.body.description,
            category : req.body.category,
            dueDate : req.body.dueDate,
            userId : req.decode.id
        }
        Todo.create(newTodo)
        .then(todo =>{
            res.status(201).json(todo)
        })
        .catch(next);
    }

    static readOwnTodo(req, res, next){
        Todo.findAll({
            where : { userId : req.decode.id }
        })
        .then(todos => {
            res.status(201).json(todos)
        })
        .catch(next)
    }

    static singleTodo(req, res, next){
        Todo.findByPk(req.params.id)
        .then(found => {
            if(!found){
                res.status(404).json({})
            }else{
                res.status(200).json(found)
            }
        })
        .catch(next)
    }

    static deleteTodo(req, res, next){
        Todo.findByPk(req.params.id)
        .then(todo => {
            if(todo){
                return Todo.destroy({
                    where : { id : req.params.id }
                })
            }else{
                throw({ code : 404})
            }
        })
        .then(deletedData => {
            res.status(200).json({ id : req.params.id })
        })
        .catch(next)
    }

    static updateTodo(req, res, next){
        Todo.findByPk(req.params.id)
        .then(todo => {
            if(todo){
                todo.title = req.body.title || todo.title
                todo.description = req.body.description || todo.description
                todo.category = req.body.category ||  todo.category
                todo.dueDate = req.body.dueDate || todo.dueDate
                todo.statusFinished = req.body.statusFinished || todo.statusFinished
            return todo.save()
            } else {
                throw ({ code : 404})
            }
        })
        .then(updatedData => {
            res.status(200).json(updatedData)
        })
        .catch(next)
    }
}



module.exports = todoController