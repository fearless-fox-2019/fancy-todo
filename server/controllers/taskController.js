const taskModel = require('../models/taskModel')

class TaskController {
    static getOne(req, res, next) {
        let taskId = req.params.taskId
        taskModel
            .findById(taskId)
            .then((task) => {
                res.status(200).json(task)
            })
            .catch(next)
    }
    static getByList(req, res, next) {
        let listId = req.params.listId
        console.log(listId)

        taskModel
            .find({listId})
            .then(success => {
                res.status(200).json(success)
            })
            .catch(next)
    }

    static async getIncluded(req, res, next) {
        let creator = req.logedUser._id
        try {
            let userTask = await taskModel.find({
                creator
            })
            res.json({
                userTask
            })
        } catch (error) {
            next(error)
        }
    }

    static create(req, res, next) {
        let creator = req.logedUser._id
        let {
            name,
            description,
            listId,
            duedate
        } = req.body
        console.log(req.body, 'ini req body')
        let newTask = {
            name,
            description,
            duedate: new Date(duedate),
            creator,
            listId
        }
        console.log(newTask)
        taskModel
            .create(newTask)
            .then((created) => {
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
            .then((done) => {
                console.log(done)
                res.status(200).json(done)
            })
            .catch(next)
    }
    static delete(req, res, next) {
        let taskId = req.params.taskId

        taskModel
            .findByIdAndDelete(taskId)
            .then((finalResult) => {
                res.status(200).json(finalResult)
            })
            .catch(next)
    }
}

module.exports = TaskController