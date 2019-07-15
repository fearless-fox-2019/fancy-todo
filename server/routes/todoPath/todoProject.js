const router = require('express').Router()
const authMember = require('../../middlewares/autorizeMember')
const ControllerTodo = require('../../controllers/todos')

//  api/todos/project
router.get('/:projectId', authMember.byProjectId, ControllerTodo.findAllProject)
router.post('/:projectId', authMember.byProjectId, ControllerTodo.create)
router.put('/:todoId', authMember.byTodoId, ControllerTodo.update)
router.patch('/status/:todoId', authMember.byTodoId, ControllerTodo.updateStatus)
router.delete('/:todoId', authMember.byTodoId, ControllerTodo.delete)


module.exports = router