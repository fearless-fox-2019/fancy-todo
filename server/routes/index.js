const express = require('express')
const route = express.Router()
const user = require('./user')
const todo = require('./todo')
const project = require('./project')
const { authentication } = require('../middlewares/auth')

route.use('/users', user)

router.use(authentication)

route.use('/todos', todo)
route.use('/projects', project)

module.exports = route