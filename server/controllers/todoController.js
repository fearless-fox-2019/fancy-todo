const Todo = require('../models/todo')
const Project = require('../models/project')

class TodoController{
    static add(req, res){
        console.log('masuk add todo')
        let newTodo = new Todo ({
            userId : req.loggedUser._id,
            description : req.body.description,
            status : req.body.status,
            dueDate : req.body.dueDate,
            name : req.body.name
        })

        newTodo.save()
            .then(data => {
                res.status(201).json(data)
            })
            .catch(err => {
                res.status(500).json({error : err})
            })
    }

    static update(req, res){
        let id = req.params.id
        let obj = {}
        if (req.body.description) obj.description = req.body.description
        if (req.body.dueDate) obj.dueDate = req.body.dueDate
        if (req.body.status) obj.status = req.body.status
        if (req.body.name) obj.name = req.body.name
        Todo.findByIdAndUpdate(id, obj)
            .then(data => {
                res.json({ message : 'updated', response : data})
            })
            .catch(err => {
                res.json(err)
            })
    }

    static async delete(req, res, next){

        try {

            let todo = await Todo.findByIdAndDelete(req.params.id)
         

            res.json({message : 'deleted', response : todo})

        } catch (error) {
            next(error)
        }

    }

    static readAll(req, res){
        let id = req.params.id

        Todo.find({}).populate('userId')
            .then(data => {
                console.log(data)
                res.json(data)
            })
            .catch(err => {
                console.log(err)
                res.status(500).json(err)
            })
    }
}

module.exports = TodoController