const Todo = require('../models/todo')

class TodoController{
    static showList(req,res,next){
        Todo.find({user_id: req.decoded.id,isProject : false},function(err,data){
            if(err){
                next
            }else{
                res.json(data)
            }
        })
    }

    static create(req,res,next){
        Todo.create({
            name: req.body.name,
            description: req.body.desc,
            due_date: req.body.due_date,
            user_id: req.decoded.id
        })
        .then(function(newtodo){
            res.status(201).json(newtodo)
        })
        .catch(next)
    }

    static findOneTodo(req,res,next){
        Todo.findById({_id:req.params.todoid}, function(err,data){
            if(err){
                next
            }else{
                res.json(data)
            }
        })
    }
    static update(req,res,next){
        Todo.updateOne({_id: req.params.todoid},
            {
                name: req.body.name,
                description: req.body.desc,
                due_date: req.body.due_date
            },function(err,data){
                if(err){
                    next
                }else{
                    res.status(200).json(data)
                }
            }
        )
    }

    static updateStatus(req,res,next){
        Todo.updateOne({_id: req.params.todoid},
            {
                status : true
            },function(err,data){
                if(err){
                    next
                }else{
                    res.status(200).json(data)
                }
            }
        )
    }

    static delete(req,res,next){
        Todo.findByIdAndDelete({_id: req.params.todoid } , function(err,data){
            if(err){
                next
            }else{
                res.json(data)
            }
        })
    }

    static search(req,res,next){
        Todo.find({name: req.params.search, user_id: req.decoded.id},function(err,data){
            if(err){
                next
            }else{
                res.json(data)
            }
        })
    }

}

module.exports = TodoController