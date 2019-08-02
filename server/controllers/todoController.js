const TodoSchema = require('../models/todos')
const mongoose = require('mongoose')
const Todo = mongoose.model('Todo',TodoSchema)


class TodoController {
    static create(req,res,next) {
        // console.log(req.body)
    // const decoded = 
       const {name,description,dueDate} = req.body
       const input = {
           name:name,
           description:description,
           dueDate:dueDate,
           userId: req.decoded._id
       }
    //    console.log(input)
       Todo.create(input)
        .then((todos) => {
            res.status(201).json(todos)
        })
        .catch(next)
    }

    static listTodo(req,res,next) {
        Todo.find({userId: req.decoded._id})
            .then((datas) => {
                res.status(201).json(datas)
            })
            .catch(next)
    }

    static deleteTodo(req,res,next) {
        Todo.findByIdAndDelete(req.params.id)
            .then((datasDeleted) => {
                res.status(200).json(datasDeleted)
            })
            .catch(next)
    }

    static completeTodo(req,res,next) {
        Todo.findById(req.params.id)
            .then((todoFound) => {
                if(todoFound.status) {
                    todoFound.status = false
                } else {
                    todoFound.status = true
                }
                return todoFound.save()
            })
            .then((dataUpdated) => {
                res.status(200).json(dataUpdated)
                // console.log(dataUpdated);
                // console.log('asd')
            })
            .catch(next)
    }

    static bookmarkTodo(req,res,next) {
        Todo.findById(req.params.id)
            .then((todoFound) => {
                if(todoFound.is_starred) {
                    todoFound.is_starred = false
                } else {
                    todoFound.is_starred = true
                }
                return todoFound.save()
            })
            .then((dataUpdated) => {
                res.status(200).json(dataUpdated)
            })
            .catch(next)
    }

    static search(req,res,next) {
        const regex = new RegExp(req.query.search,'i')
        // console.log(req.query)
        Todo.find({name: {$regex: regex}, userId: req.decoded._id})
            .then((foundData) => {
                if(foundData.length === 0) {
                    throw {status: 404, message: 'no data found'}
                } else {
                    res.status(200).json(foundData)
                }
            })
            .catch(next)
    }
}

module.exports = TodoController