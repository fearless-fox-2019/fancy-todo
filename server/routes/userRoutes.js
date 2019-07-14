const router = require('express').Router()
const UserController = require('../controllers/userController')
const { authentication } = require('../middlewares/middleware')

router.post('/register', UserController.register)
router.post('/login', UserController.login)
router.post('/loginGoogle', UserController.loginGoogle)

router.get('/',authentication, UserController.findAll)
router.get('/:id',authentication, UserController.findOne)


module.exports = router