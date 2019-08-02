const todo = require('../models/todo')
const user = require('../models/user')

class todoController{

    static createTodo(req, res, next){
        console.log(req.decode.id)
        console.log('masuk ke todo routes create todo')
        const newTodo = {
            title : req.body.title,
            description : req.body.description,
            category : req.body.category,
            dueDate : req.body.dueDate,
            userId : req.decode.id
        }
        // console.log(userId)
        console.log(newTodo, "ini todo baru");
        todo.create(newTodo)
        .then(todo =>{
            res.status(201).json(todo)
        })
        .catch(next);
    }

    static readOwnTodo(req, res, next){
        console.log('masuk ke read all todo')
        todo.find({ userId : req.decode.id })
        .then(todos => {
            res.status(201).json(todos)
        })
        .catch(next)
    }

    static singleTodo(req, res, next){
        console.log('masuk ke findOne todo')
        todo.findById(req.params.id)
        .then(found => {
            if(!found){
                res.status(404).json({})
            }else{
                console.log('ketemu')
                res.status(200).json(found)
            }
        })
        .catch(next)
    }

    static deleteTodo(req, res, next){
        todo.findById(req.params.id)
        .then(todo => {
            if(todo){
                todo.deleteOne({ id : req.params.id })
                res.status(200).json({ id : req.params.id })
            }else{
                throw({ code : 404, message : 'Todo not Exist'})
            }
        })
        .catch(next)
    }

    static updateStatus(req, res, next){
        console.log('masuk ke controller server update status')
        console.log(req.body)
        todo.findByIdAndUpdate(req.params.id, {$set: { ...req.body }},{new: true})
        .then(todo =>{
            res.status(200).json(todo)
        })
        .catch(next)
    }

    // static updateStatusTodo(req, res, next){
    //     todo.findById(req.params.id)
    //     .then(todo => {
    //         if(todo){
    //             todo.category = req.body.category ||  todo.category
    //         return todo.save()
    //         } else {
    //             throw ({ code : 404})
    //         }
    //     })
    //     .then(updatedData => {
    //         res.status(200).json(updatedData)
    //     })
    //     .catch(next)
    // }

    static updateTodo(req, res, next){
        todo.findById(req.params.id)
        .then(todo => {
            if(todo){
                todo.title = req.body.title || todo.title
                todo.description = req.body.description || todo.description
                todo.dueDate = req.body.dueDate || todo.dueDate
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