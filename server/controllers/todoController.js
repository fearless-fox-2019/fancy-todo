const todoModel = require('../models/taskModel')

class TodoController {
    static getOne(req, res, next) {}
    static getAll(req, res, next) {}
    static create(req, res, next) {
        let creator = rq.logedUser.userId
        let {
            name,
            description,
            status,
            duedate,
            creator,
            projectId,
            listId
        } = req.body
        let newtodo = {
            name,
            description,
            status,
            duedate,
            creator,
            projectId,
            listId
        }
console.log(newtodo)

    }
    static update(req, res, next) {}
    static delete(req, res, next) {}
}

module.exports = TodoController