if (process.env.NODE_ENV === 'development') {
  require('dotenv').config();
}
const Todo = require('../models/todo');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

class ControllerTodo {

  static create(req, res, next) {
    const input = {
      name : req.body.name,
      dueDate : new Date (req.body.date),
      description : req.body.description,
      creator : req.decoded.id
    }
    Todo.create(input)
    .then((created) => {
      // return User.
      console.log(created);
      res.status(201).json(created)
    })
    .catch(next)
  }

  static getAll(req, res, next) {
    Todo.find({
      creator : req.decoded.id
    })
    .then((results) => {
      res.status(200).json(results)
    })
    .catch(next)
  }

  static getPending(req, res, next) {
    Todo.find({
      creator : req.decoded.id,
      isFinished : false
    })
    .then((results) => {
      res.status(200).json(results)
    })
    .catch(next)
  }

  static getComplete(req, res, next) {
    Todo.find({
      creator : req.decoded.id,
      isFinished : true
    })
    .then((results) => {
      res.status(200).json(results)
    })
    .catch(next)
  }

  static deleteTask(req, res, next) {
    Todo.remove({
      _id : req.headers.id
    })
    .then((deleted) => {
      res.status(200).json(deleted)
    })
    .catch(next)
  }

  static updateTask(req, res, next) {
    Todo.findOne({
      _id : req.headers.id
    })
    .then((found) => {
      found.isFinished = true
      found.save()
      console.log(found);
      res.status(200).json(found)
    })
    .catch(next)
  }

  static findTask(req, res, next) {
    const taskRegex = new RegExp(req.query.name, 'i')
    Todo.find({
      name : taskRegex,
      creator : req.decoded.id
    })
    .then((found) => {
      res.status(200).json(found)
    })
    .catch(next)
  }
}

module.exports = ControllerTodo
