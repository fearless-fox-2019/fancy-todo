const router = require('express').Router()
const todoListController = require('../controllers/todoListController')
const { authentication } = require('../middleware/auth')

router.use('/', authentication)
router.get('/', todoListController.getAll)
router.get('/:id', todoListController.getOne)
router.post('/', todoListController.create)
router.patch('/:id', todoListController.update)
router.delete('/:id', todoListController.delete)


module.exports = router