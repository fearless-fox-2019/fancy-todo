const router = require('express').Router()
const TodoController = require('../controllers/todoController')
const authenticate = require('../middlewares/authenticate')
const authorization = require('../middlewares/authorization')

router.use(authenticate)
router.get('/listTodo',TodoController.listTodo)
router.post('/createTodo',TodoController.create)
router.get('/filter',TodoController.search)
router.delete('/deleteTodo/:id',authorization,TodoController.deleteTodo)
router.patch('/completeTodo/:id',authorization,TodoController.completeTodo)
router.patch('/favouriteTodo/:id',authorization,TodoController.bookmarkTodo)


module.exports = router