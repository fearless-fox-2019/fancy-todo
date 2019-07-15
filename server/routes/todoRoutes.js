const router = require('express').Router()
const todoController = require('../controllers/todoController')
const authentication = require('../middlewares/authentication')
const authorization = require('../middlewares/authorization')

router.use(authentication)
router.get('/', todoController.readOwnTodo)
router.get('/:id',authorization, todoController.singleTodo)
router.post('/', todoController.createTodo)
router.delete('/:id',authorization, todoController.deleteTodo)
router.patch('/:id',authorization, todoController.updateTodo)


module.exports = router