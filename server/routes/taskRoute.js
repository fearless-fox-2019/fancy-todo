const router = require('express').Router()
const todoController = require('../controllers/taskController')
const { authentication, authorization } = require('../middleware/auth')

router.use('/', authentication)
router.post('/', todoController.create)
router.get('/:taskId', todoController.getOne)
router.patch('/:taskId', todoController.update)
router.delete('/:taskId', todoController.delete)

module.exports = router