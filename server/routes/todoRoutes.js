const router = require('express').Router()
const TodoController = require('../controllers/todoController')
const authenticate = require('../middlewares/authenticate')
const authorization = require('../middlewares/authorization')

router.use(authenticate)
router.get('/listTodo',TodoController.listTodo)
router.post('/createTodo',TodoController.create)
router.delete('/deleteTodo/:id',TodoController.deleteTodo)
router.patch('/completeTodo/:id',TodoController.completeTodo)
router.patch('/favouriteTodo/:id',TodoController.bookmarkTodo)
router.get('/filter',TodoController.search)


module.exports = router