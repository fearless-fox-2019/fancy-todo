const router = require('express').Router()
const todoController = require('../controllers/todoController')
const auth = require('../middlewares/auth').authentication
const authorization = require('../middlewares/authorization').authorization

router.use(auth)
router.get('/', todoController.getAllTodo)
router.post('/create', todoController.create)
router.post('/delete', authorization, todoController.delete)
router.post('/update', authorization, todoController.update)

module.exports = router