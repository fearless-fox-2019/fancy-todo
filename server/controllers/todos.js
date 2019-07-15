const Todo = require('../models/todos')
const generateDue_date = require('../helpers/generateDue_date')

class ControllerTodo {
  static findAllUser(req, res, next) {
    Todo.find({user: req.loggedUser._id})
    .then(result => {
      res.status(200).json(result)
    })
    .catch(next)
  }

  static findAllProject (req, res, next) {
    Todo.find({project: req.params.projectId})
    .then(result => {
      res.status(200).json(result)
    })
    .catch(next)
  }

  static create(req, res, next) {
    const { name, description, date } = req.body
    const due_date = new Date(date)
    const input = { name, description, due_date }
    if(req.params.projectId) {
      input.project = req.params.projectId
    } else {
      input.user = req.loggedUser._id
    }
    Todo.create(input)
    .then(result => {
      res.status(200).json(result)
    })
    .catch(next)
  }

  static update(req, res, next) {
    const { name, description, date } = req.body
    let due_date = new Date(date)
    const input = { name, description, due_date }
    Todo.updateOne({_id : req.params.todoId}, input)
    .then(result => {
      res.status(200).json(result)
    })
    .catch(next)
  }
  static findOne(req, res, next) {
    Todo.findById(req.params.todoId)
    .then(result => {
      res.status(200).json(result)
    })
    .catch(next)
  }

  static updateStatus(req, res, next) {
    Todo.updateOne({_id : req.params.todoId}, {status: true})
    .then(result => {
      res.status(200).json(result)
    })
    .catch(next)
  }
  
  static delete(req, res, next) {
    Todo.deleteOne({_id: req.params.todoId})
    .then(result => {
      res.status(200).json(result)
    })
    .catch(next)
  }

  static findById(req, res, next) {
    Todo.findById(req.params.todoId)
    .then(result => {
      res.status(200).json(result)
    })
    .catch(next)
  }
}

module.exports = ControllerTodo