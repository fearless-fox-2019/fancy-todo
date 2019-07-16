const router  = require('express').Router()
const projectController = require('../controllers/projectsController')
const { authentication, authorization } = require('../middleware/auth')

router.use('/',authentication)

router.get('/', projectController.getAll)
router.get('/include', projectController.getIncluded)
router.post('/', projectController.create)
router.patch('/addMember/:projectId',projectController.addMember)
router.patch('/removeMember/:projectId',projectController.removeMember)
router.get('/:projectId', projectController.get)
router.patch('/:projectId', projectController.update)
router.delete('/:projectId', projectController.delete)

module.exports = router