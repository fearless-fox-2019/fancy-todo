const router = require('express').Router()
const todo = require('../controllers/todo')
const { authentication, authorization } = require('../middlewares/auth')

router.use(authentication)
router.get('/', todo.findAll)
router.get('/id/:id', todo.findById)
router.get('/user', todo.findAllById)
router.get('/title/:title', todo.findOne)
router.get('/status/:status', todo.sortBystatus)
router.post('/', todo.create)

// authorization
router.patch('/:id',authorization, todo.edit)
router.delete('/:id',authorization, todo.delete)


module.exports = router