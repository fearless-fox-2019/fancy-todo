const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth')

const TodoController = require('../controllers/todo-controller')

router.post('/add', TodoController.create)

router.patch('/:todoId/update', auth.authorization, TodoController.update)
router.delete('/:todoId/delete', auth.authorization, TodoController.delete)

router.get('/search', TodoController.search)

module.exports = router