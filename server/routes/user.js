const router = require('express').Router()
const userController = require('../controllers/userController')

router.post('/register', userController.register)
router.post('/login', userController.login)
router.post('/login/google', userController.loginGoogle)
router.get('/allUsers', userController.getAll)

module.exports = router