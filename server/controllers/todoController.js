const Todo = require('../models/Todo')

class todoController {
    static getAllTodo (req, res, next){
        console.log('masuk controller getAllTodo')
        Todo.find({
            UserId : req.query.UserId
        })
            .then((allData)=>{
                res.status(200).json(allData)
            })
            .catch(next)
        
    }

    static create (req, res, next){
        // console.log('ini body', req.body)
        Todo.create(req.body)
            .then((todo)=>{
                res.send(todo)
            })
            .catch(next)
    }

    static delete (req, res, next){
        console.log('masuk controller deleteTodo')
        console.log(req.body)
        Todo.deleteOne({
            _id : req.body.id
        })
            .then((data)=>{
                res.status(200).json(data)
            })
            .catch(next)
    }

    static update (req, res, next){
        console.log('masuk update')
        Todo.updateOne({_id: req.query.id}, {status: req.body.status})
        .then((data)=>{
            console.log('berhasil update')
            res.send(data)
        })
        .catch(next)
    }
}

module.exports = todoController