const express = require('express')
const router = express.Router()

const UserController = require('../controllers/user-controller')
const auth = require('../middlewares/auth')

router.post('/login-google', UserController.loginGoogle)

router.get('/login', UserController.loginPage)
router.post('/login', UserController.login)
router.post('/register', UserController.register)

router.use(auth.authentication) // authentication

router.get('/todos', UserController.getTodo)

module.exports = router