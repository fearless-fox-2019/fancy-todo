const todoListModel = require('../models/todoListModel')

class todoListController {
    static getOne(req, res, next) {
        let listId = req.params.listId
        console.log(listId)

        todoListModel
            .findById(listId)
            .then((task)=>{
                console.log(task)
                res.status(200).json(task)
            })
            .catch(next)
    }
    static getAll(req, res, next) {
        todoListModel
            .find()
            .populate('taskId')
            .then((allData)=> {
                console.log(allData)
                res.status(200).json(allData)
            })
            .catch(next)
    }
    static create(req, res, next) {
        let { name, projectId } = req.body
        let newList
        let creator = req.logedUser._id

        if(!projectId){
            newList = { name, creator }
        }
        else {
            newList = { name, creator, projectId: projectId || null }
        }

        todoListModel
            .create(newList)
            .then((created)=> {
                console.log('Success Create List')
                res.status(201).json(created)
            })
            .catch(next)
    }
    static update(req, res, next) {
        let listId = req.params.listId
        let taskId = req.body.taskId
        todoListModel
            .findById(listId)
            .then((found)=>{
                console.log(found)
                found.taskId.push(taskId)
                let updatetaskId = new todoListModel(found)
                return updatetaskId.save()
            })
            .then((result)=>{
                console.log(result)
                res.status(200).json(result)
            })
            .catch(next)
    }
    static delete(req, res, next) {
        let taskId = req.params.taskId

        todoListModel
            .findByIdAndDelete(taskId)
            .then((success)=>{
                console.log(success)
                res.status(200).json({
                    message: `success delete task with id ${taskId}`,
                    success
                })
            })
            .catch(next)
    }
}

module.exports = todoListController