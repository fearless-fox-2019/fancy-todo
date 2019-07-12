const router = require('express').Router()
const todoController = require('../controllers/todoController')
const { authentication, authorize } = require('../middleware/auth')

router.use('/', authentication)
router.get('/', todoController.getAll)
router.get('/:id', todoController.getOne)
router.post('/', todoController.create)
router.patch('/:id', todoController.update)
router.delete('/:id', todoController.delete)

module.exports = router