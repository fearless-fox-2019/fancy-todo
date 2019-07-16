const router  = require('express').Router()
const userController = require('../controllers/userController')
const {authentication} = require('../middleware/auth')

router.post('/signup',userController.signUp)
router.post('/signin',userController.signIn)
router.post('/signin/google',userController.signGoogle)

router.use('/', authentication)

router.get('/userData',userController.userData)
router.get('/getByName/:username',userController.getByName)

module.exports = router