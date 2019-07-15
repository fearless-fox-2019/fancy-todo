const router = require('express').Router()
const authUser = require('../../middlewares/authorizeUser')
const ControllerTodo = require('../../controllers/todos')

// api/todos/user
router.get('/', ControllerTodo.findAllUser)
router.get('/:todoId', ControllerTodo.findById)
router.post('/', ControllerTodo.create)
router.put('/:todoId', authUser,ControllerTodo.update )
router.patch('/status/:todoId', authUser, ControllerTodo.updateStatus)
router.delete('/:todoId', authUser, ControllerTodo.delete)

module.exports = router