const router = require('express').Router()
const taskController = require('../controllers/taskController')
const { authentication, authorization } = require('../middleware/auth')

router.use('/', authentication)

router.get('/', taskController.getIncluded)
router.post('/', taskController.create)
router.get('/:taskId', taskController.getOne)
router.patch('/:taskId', taskController.update)
router.delete('/:taskId', taskController.delete)

module.exports = router