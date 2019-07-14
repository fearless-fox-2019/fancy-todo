const router = require('express').Router()
const TodoController = require('../controllers/todoController')
const {authentication, authorization} = require('../middlewares/middleware')


router.use(authentication)
router.get('/', TodoController.readAll)
router.post('/', TodoController.add)
router.delete('/:id', TodoController.delete)
router.put('/:id', TodoController.update)

module.exports = router