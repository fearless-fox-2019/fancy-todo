const todoListModel = require('../models/todoListModel')
const taskModel = require('../models/taskModel')

class todoListController {
    static getOne(req, res, next) {
        let name = req.params.name
        console.log(name, '_+_+_+_+_+_+_+')
        todoListModel
            .findOne({
                name
            })
            .then((task) => {
                console.log('masuk disini')
                res.status(200).json(task)
            })
            .catch(next)
    }
    static getAll(req, res, next) {
        let creator = req.logedUser._id
        todoListModel
            .find({
                creator
            })
            .populate('taskId')
            .then((allData) => {
                res.status(200).json({
                    userList: allData
                })
            })
            .catch(next)
    }
    static create(req, res, next) {
        let {
            name,
            projectId
        } = req.body
        let newList
        let creator = req.logedUser._id

        if (!projectId) {
            newList = {
                name,
                creator
            }
        } else {
            newList = {
                name,
                creator,
                projectId
            }
        }

        todoListModel
            .create(newList)
            .then((created) => {
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
            .then((found) => {
                found.taskId.push(taskId)
                let updatetaskId = new todoListModel(found)
                return updatetaskId.save()
            })
            .then((result) => {
                res.status(200).json(result)
            })
            .catch(next)
    }

    static updateList(req, res, next) {
        let listId = req.params.listId
        let update = {
            name: req.body.name
        }

        todoListModel
            .findByIdAndUpdate(listId, update, {
                new: true
            })
            .then(updated => {
                res.json(updated)
            })
            .catch(next)
    }
    static delete(req, res, next) {
        let listId = req.params.listId

        taskModel
            .deleteMany({
                listId
            })
            .then(() => {
                return todoListModel.findByIdAndDelete(listId)
            })
            .then((deleted) => {
                console.log(deleted)
                res.status(200).json(deleted)
            })
            .catch(next)
    }
}

module.exports = todoListController