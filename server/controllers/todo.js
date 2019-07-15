const jwt = require("../helpers/jwt");
const Todo = require("../models/todo");
const User = require("../models/user");


class TodoController{

    static create(req, res, next){
        const tokenData = jwt.decode((req.headers.token.split(' ').join("")));
        const ownerId = tokenData.id;
        
        console.log(req.body);
        const newTodo = {
            ...req.body,
            status: "not-completed",
            owner: ownerId
        }

        Todo.create(newTodo)
            .then((data) => {
                res.status(200).json(data);
            })
            .catch(next);
    }

    static findAll(req, res, next){
        const tokenData = jwt.decode((req.headers.token.split(' ').join("")));
        const ownerId = tokenData.id;
        Todo.find({owner: ownerId})
            .populate("owner")
            .sort({timePlan:1})
            .then((data) => {
                res.status(200).json(data);
            })
            .catch(next);
    }

    static findOne(req, res, next){
        const tokenData = jwt.decode((req.headers.token.split(' ').join("")));
        const ownerId = tokenData.id;
        const {todoId} = req.params;

        Todo.findById(todoId)
            .populate("owner")
            .then((data) => {
                if(data){
                    if(data.owner.id == ownerId){
                        res.status(200).json(data);
                    }else{
                        throw new Error({code: 401, message: "Unauthorized Request"});
                    }
                }else{
                    res.status(404).json({message: "Data not found"});
                }
            })
            .catch(next);
    }

    static update(req, res, next){
        const tokenData = jwt.decode((req.headers.token.split(' ').join("")));
        const ownerId = tokenData.id;
        const {todoId} = req.params;

        Todo.findById(todoId)
            .populate("owner")    
            .then((data) => {
                if(data.owner.id == ownerId){
                    let updateData = {};
                    for(let key in req.body){
                        if(data[key] != undefined){
                            updateData[key] = req.body[key]
                        }
                    }
                    return data.update(updateData)
                }else{
                    throw new Error({code: 401, message: "Unauthorized Request"});
                }
            })
            .then((data) => {
                console.log(data);
                res.status(200).json(data);
            })
            .catch(next);
    }

    static delete(req, res, next){
        const tokenData = jwt.decode((req.headers.token.split(' ').join("")));
        const ownerId = tokenData.id;
        const {todoId} = req.params;

        Todo.findById(todoId)
            .populate("owner")
            .then((data) => {
                if(data.owner.id == ownerId){
                    return Todo.findByIdAndDelete(data._id)
                }else{
                    throw new Error({code: 401, message: "Unauthorized Request"});
                }
            })
            .then((data) => {
                console.log(data);
                res.status(200).json(data);
            })
            .catch(next);

    }

}

module.exports = TodoController;