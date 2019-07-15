const router = require('express').Router()
const User = require('../controllers/user')

router.get('/test', (req, res) => {
    res.status(200).json({
        message: 'User route'
    })
})

router.post('/signin', User.signin)
router.post('/signup', User.signup)
router.post('/googlesignin', User.googlesignin)

module.exports = router