const router = require('express').Router()
const userRoute = require('./user')
const todoRoute = require('./todo')
const weatherRoute = require('./weather')

router.use('/users', userRoute)
router.use('/todos', todoRoute)
router.use('/weathers', weatherRoute)

module.exports = router