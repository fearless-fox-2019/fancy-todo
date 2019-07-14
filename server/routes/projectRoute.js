const router = require('express').Router()
const ProjectController = require('../controllers/projectController')
const {authentication, authorization} = require('../middlewares/middleware')

router.use(authentication)
router.post('/', ProjectController.create)
router.get('/', ProjectController.findAll)


router.patch('/:id/invite',authorization.project, ProjectController.inviteMember)
router.post('/:id/todo',authorization.project, ProjectController.createTodoProject)
router.get('/:id',authorization.project, ProjectController.findOne)
router.delete('/todo/:todoId/:id',authorization.project, ProjectController.deleteTodoProject)

router.patch('/:id/invite/accept',authorization.invite, ProjectController.acceptInvitation)
router.patch('/:id/invite/reject',authorization.invite, ProjectController.rejectInvitation)

router.delete('/:id',authorization.project, ProjectController.deleteProject)
router.patch('/todo/:todoId/:id',authorization.project, ProjectController.updateTodoProject)


module.exports = router