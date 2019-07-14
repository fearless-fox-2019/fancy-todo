const express = require('express')
const todoRouter = express.Router()
const TodoController = require('../controllers/todoController')
const authentication = require('../middlewares/authentication')
const {authorizationIndividu} = require('../middlewares/authorization')

todoRouter.use(authentication)
todoRouter.get('/',TodoController.showList)
todoRouter.post('/',TodoController.create)
todoRouter.get('/:todoid',TodoController.findOneTodo)
todoRouter.get('/search/:search',TodoController.search)

todoRouter.use(':todoid',authorizationIndividu)
todoRouter.delete('/:todoid',TodoController.delete)
todoRouter.put('/:todoid',TodoController.update)
todoRouter.patch('/:todoid',TodoController.updateStatus)

module.exports = todoRouter