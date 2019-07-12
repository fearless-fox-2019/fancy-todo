const taskModel = require('../models/taskModel')
const tasklistModel = require('../models/todoListModel')

class TaskController {
    static getOne(req, res, next) {
        let taskId = req.params.taskId

        taskModel
            .findById(taskId)
            .then((task) => {
                console.log(task)
                res.status(200).json(task)
            })
            .catch(next)
    }
    static create(req, res, next) {
        console.log(req.logedUser)
        let creator = req.logedUser._id
        let {
            name,
            description
        } = req.body
        let newTask = {
            name,
            description,
            duedate: new Date(),
            creator
        }
        console.log(newTask)

        taskModel
            .create(newTask)
            .then((created) => {
                console.log(created)
                res.status(200).json(created)
            })
            .catch(next)

    }
    static update(req, res, next) {
        let taskId = req.params.taskId
        let {
            status,
            name,
            description
        } = req.body
        
        taskModel
            .findById(taskId)
            .then((found) => {
                if (status) {
                    console.log(found,'<=== ini before')
                    found.status = status
                }
                if (name) {
                    found.name = name
                }
                if (description) {
                    found.description = description
                }
                let updated = new taskModel(found)
                
                return updated.save()
            })
            .then((done)=> {
                console.log(done)
                res.status(200).json(done)
            })
            .catch(next)
    }
    static delete(req, res, next) {
        let taskId = req.params.taskId
        let listId = req.body.listId

        // console.log(taskId)
        taskModel
            .findByIdAndDelete(taskId)
            .then(() => {
                return tasklistModel
                    .findById(listId)
            })
            .then((taskList) => {
                taskList.taskId = taskList.taskId.filter(id => {
                    id !== taskId
                })
                let updatedTaskList = new tasklistModel(taskList)

                return updatedTaskList.save()
            })
            .then((finalResult) => {
                console.log(finalResult)
                res.status(200).json(finalResult)
            })
            .catch(next)
    }
}

module.exports = TaskController