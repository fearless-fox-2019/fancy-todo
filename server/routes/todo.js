const express = require('express')
    , todoRouter = express.Router()
    , todoController = require('../controllers/todo')
    , authentication = require('../middleware/authentication')

todoRouter.get('/', authentication,todoController.findAll)
todoRouter.get('/:todoId', authentication,todoController.findById)
todoRouter.post('/', authentication,todoController.create)
todoRouter.put('/:todoId', authentication,todoController.replace)
todoRouter.patch('/:todoId', authentication,todoController.update)
todoRouter.delete('/:todoId', authentication, todoController.deleteById)

module.exports = todoRouter