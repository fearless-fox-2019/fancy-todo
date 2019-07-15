const router = require('express').Router()
const todoController = require('../controllers/todoController')

router.post('/create', todoController.create)
router.get('/all', todoController.getAllTodoByUser)
router.delete('/:id', todoController.deleteTodo)
router.put('/:id', todoController.updateTodo)

module.exports = router