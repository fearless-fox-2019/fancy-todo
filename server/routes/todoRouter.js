const router = require('express').Router()
const todoController = require('../controllers/todoController')
const Authentication = require('../middlewares/authentication')
const Authorization = require('../middlewares/authorization')


router.post('/createtodo', Authentication, todoController.createTodo)
router.get('/listTodo', Authentication, Authorization, todoController.listTodoAuthorize)
router.get('/listTodo/:keyword', Authentication, Authorization, todoController.todoSearch)
router.get('/editTodo/:id', Authentication, Authorization, todoController.getTodo)
router.put('/editTodo/:id', Authentication, Authorization, todoController.updateTodo)
router.delete('/deleteTodo/:id', Authentication, Authorization, todoController.deleteTodo)

module.exports = router