const router = require('express').Router()
const todoListController = require('../controllers/todoListController')
const { authentication } = require('../middleware/auth')

router.use('/', authentication)

router.get('/', todoListController.getAll)
router.post('/', todoListController.create)
router.get('/:name', todoListController.getOne)
router.patch('/updatelist/:listId', todoListController.updateList)
router.patch('/:listId', todoListController.update)
router.delete('/:listId', todoListController.delete)


module.exports = router