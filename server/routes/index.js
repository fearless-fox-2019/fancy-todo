const router = require('express').Router()
const userRouter = require('./user')
const todoRouter = require('./todo')

router.use('/users', userRouter)
router.use('/todos', todoRouter)
module.exports = router