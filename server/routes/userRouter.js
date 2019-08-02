const router = require('express').Router()
const userController = require('../controllers/userController')
const Authentication = require('../middlewares/authentication')
const Authorization = require('../middlewares/authorization')

router.post('/register', userController.register)

router.post('/login', userController.login)
router.post('/loginGoogle', userController.googleLogin)

module.exports = router