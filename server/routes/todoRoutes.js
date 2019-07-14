const router = require('express').Router()
const TodoController = require('../controllers/todoController')
const authentication = require('../middlewares/authentication')
const authorization = require('../middlewares/authorization')

router.get('/uncomplete', authentication, TodoController.findUncomplete)
router.get('/complete', authentication, TodoController.findComplete)
router.post('/add', authentication, TodoController.create)
router.patch('/complete/:id', authentication, authorization,TodoController.updateTodoStatus)
router.delete('/delete/:id', authentication, authorization,TodoController.delete)
router.post('/search', authentication, TodoController.searchName)
router.post('/sendEmail', authentication, TodoController.sendEmail)

module.exports = router