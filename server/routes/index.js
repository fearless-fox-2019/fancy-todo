const router = require('express').Router()
const todoRouters = require('./todoRouter')
const userRouters = require('./userRouter')

router.use('/todos', todoRouters)
router.use('/users', userRouters)

module.exports = router