const Todo = require('../models/todos')

module.exports = (req, res, next) => {
  Todo.findById(req.params.todoId)
  .then(todo => {
    if(todo) {
      if(todo.user == req.loggedUser._id) {
        next()
      } else {
        next({status: 401, message: 'Error authorization!'})
      }
    } else {
      next({ status: 400, message: 'todo not found'})
    }
  })
  .catch(next)
}