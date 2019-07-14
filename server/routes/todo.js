const router= require('express').Router()
const todoController= require('../controllers/todoController')
const {authentication}= require('../middlewares/authenticate')

router.use(authentication)
router.get('/:status/:projectId', todoController.findAll)
router.get('/:todoId', todoController.findOne)
router.post('/', todoController.create)
router.patch('/:todoId', todoController.update)
router.delete('/:todoId', todoController.remove)


module.exports= router