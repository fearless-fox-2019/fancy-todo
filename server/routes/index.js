const router = require('express').Router()
const userRoutes = require('./userRoutes')
const todoRoutes = require('./todoRoutes')
const projectRoutes = require('./projectRoute')

router.use('/users', userRoutes)
router.use('/todos', todoRoutes)
router.use('/projects', projectRoutes)

module.exports = router