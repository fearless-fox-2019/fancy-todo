const router = require('express').Router()
const userController = require('../controllers/userController')
const googleSignInController = require('../controllers/googleSignInController')

router.post('/register', userController.register)
router.post('/login', userController.login)
router.post('/googleSignIn', googleSignInController.loginFromGoogle)

module.exports = router