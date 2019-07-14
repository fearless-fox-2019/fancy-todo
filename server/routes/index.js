const express = require('express')
const router = express.Router()
const userRouter = require('./user')
const todoRouter = require('./todo')
const projectRouter = require('./project')
const axios = require('axios')

router.use('/users',userRouter)
router.use('/todos', todoRouter)
router.use('/projects', projectRouter)


module.exports = router