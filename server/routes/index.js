const router = require('express').Router()
const userRoute = require('./user')
const todoRoute = require('./todo')
const projectRoute = require('./project')
const authentication = require('../middlewares/authentication')

router.get('/test', (req, res) => {
    res.status(200).json({
        message: 'Home route'
    })
})

router.use('/users', userRoute)
router.use('/todos', authentication, todoRoute)
router.use('/projects', authentication, projectRoute)

module.exports = router