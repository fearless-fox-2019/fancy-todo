const Todo = require('../models/todo')
const {verify} = require('../helpers/jwt')

class TodoController{
    static createTodo(req, res, next){
        console.log("masuk create todo");
        console.log(req.decoded);
        
        const {name, description, due_date} = req.body
        const newTodo = {name, description, due_date, UserId: req.decoded.id}
        Todo.create(newTodo)
        .then(data => {
            console.log(data);
            res.status(201).json({
                message : `Created!`,
                data
            })
        })
        .catch(next)
    }

    static listTodoAuthorize(req, res, next){
        console.log(req.decoded, "ini dai listTodoAutor");
        
        Todo.find({UserId : req.decoded.id }).sort({status : -1, due_date : 1})
        .then(todos => {
            todos.name = { name : req.decoded.name}
            console.log(todos);
            res.status(200).json({
                listTodo : todos,
                name : req.decoded.name
            })
        })
        .catch(next)
    }

    static deleteTodo(req, res, next){
        Todo.deleteOne({ _id : req.params.id})
        .then(() => {
            res.send(200).json({
                message : 'deleted'
            })
        })
        .catch(next)
    }

    static getTodo(req, res, next){
        console.log(req.params.id);
        
        Todo.findById(req.params.id)
        .then(found => {
            console.log(found);
            console.log("ke update");
            res.status(200).json(found)
        })
        .catch(next)
    }

    static updateTodo(req, res, next){
        console.log(req.body);
        let updateTodo = {}
        req.body.name && (updateTodo.name = req.body.name)
        req.body.description && (updateTodo.description = req.body.description)
        req.body.statusTodo && (updateTodo.status = req.body.statusTodo)
        req.body.due_date && (updateTodo.due_date = req.body.due_date)

        Todo.findByIdAndUpdate(req.params.id, updateTodo, { new : true })
        .then(found => {
            console.log(found);
            console.log("ke update");
            res.status(200).json(found)
        })
        .catch(err =>{
            console.log(err);
            
        })
    }

    static todoSearch(req, res, next){
        Todo.find({UserId : req.decoded.id , name : {$regex : '.*' + req.params.keyword + '.*'}}).sort({status : -1, due_date : 1})
        .then(todos => {
            res.status(200).json(todos)
        })
        .catch(next)
    }
}

module.exports = TodoController