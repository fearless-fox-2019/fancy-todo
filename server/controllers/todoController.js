const Todo= require('../models/todo')
const Project= require('../models/project')

class todoController{

    static create(req,res, next){
        let {name, description, dueDate, projectId}= req.body
        let newTodo= {
            name: name,
            description: description,
            dueDate: dueDate,
            userId: req.decode.id,
            projectId: projectId
        }
        
        Todo.create(newTodo)
        .then(todo =>{
            res.status(201).json(todo)
        })
        .catch(next)
    }

    static findAll(req, res, next){
        Todo.find({userId: req.decode.id})
        .populate('projectId')
        .sort({dueDate: -1})
        .then(todos =>{
            res.status(200).json(todos)
        })
        .catch(next)
    }

    static findOne(req, res, next){
        Todo.findById(req.params.todoId)
        .populate('userId')
        .populate('projectId')
        .then(todo =>{
            res.status(200).json(todo)
        })
        .catch(next)
    }

    static update(req, res, next){
        Todo.findByIdAndUpdate(req.params.todoId, {$set: { ...req.body }})
        .then(todo =>{
            res.status(200).json(todo)
        })
        .catch(next)
    }

    static remove(req, res, next){
        Todo.findById(req.params.id)
        .then(todo=>{
            if(todo){
                Todo.deleteOne({_id: todo._id})
                .then(() =>{
                    res.status(200).json({todo})
                })
                .catch(next)

            }else{
                throw {code: 404, message: 'Todo not found!'}
            }
        })
        .catch(next)
    }
}

module.exports= todoController