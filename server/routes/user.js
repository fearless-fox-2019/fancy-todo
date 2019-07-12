const router= require('express').Router()
const userController= require('../controllers/userController')
const {authentication}= require('../middlewares/authenticate')

router.get('/', authentication, userController.findAll)
router.post('/login', userController.login)
router.post('/register', userController.register)
router.post('/loginGoogle', userController.loginGoogle)

module.exports= router