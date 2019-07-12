const router  = require('express').Router()
const userController = require('../controllers/userController')

router.post('/signup',userController.signUp)
router.post('/signin',userController.signIn)
router.post('/signin/google',userController.signGoogle)

module.exports = router