const router = require('express').Router()
const userRouter = require('./userRoute')
const todoRouter = require('./todoRoute')
const projectRouter = require('./projectRoute')
const todoList = require('./todoListRoute')

router.use('/users',userRouter)
router.use('/todos',todoRouter)
router.use('/todolists',todoList)
// router.use('/projects',projectRouter)

module.exports = router