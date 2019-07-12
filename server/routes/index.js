const router = require('express').Router()
const userRouter = require('./userRoute')
const taskRouter = require('./taskRoute')
const projectRouter = require('./projectRoute')
const todoList = require('./todoListRoute')

router.use('/users',userRouter)
router.use('/tasks',taskRouter)
router.use('/todolists',todoList)
router.use('/projects',projectRouter)

module.exports = router