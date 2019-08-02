const router = require('express').Router()
// const StudentController = require('../controller/studentController')
const UserController = require('../controllers/userController')
// router.get('/',UserController.findAll)
router.post('/register',UserController.create)
router.post('/login',UserController.login)
router.post('/googleSignIn',UserController.googleSignIn)
router.get('/confirmation/:token',UserController.confirmEmail)
module.exports = router
