const router = require('express').Router()
const ControllerUser = require('../controllers/users')
// /api/users
router.get('/', ControllerUser.findAll)
router.get('/:email', ControllerUser.findOne)
router.post('/register', ControllerUser.create)
router.post('/login', ControllerUser.login)
router.post('/login/google', ControllerUser.googleSignin)


module.exports = router