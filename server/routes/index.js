const router = require('express').Router()
const userRoutes = require('./users')
const todoRoutes = require('./todos')
const projectRoutes = require('./projects')
router.use('/users', userRoutes)
router.use('/todos', todoRoutes)
router.use('/projects', projectRoutes)
module.exports = router
