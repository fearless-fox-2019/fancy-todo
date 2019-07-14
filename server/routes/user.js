const router = require('express').Router()
const user = require('../controllers/user')

//register
router.post('/', user.create)
//get all
router.get('/', user.findAll)
//login
router.post('/login', user.login)

module.exports = router