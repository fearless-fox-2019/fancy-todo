const express = require('express')
const route = express.Router()
const user = require('./user')
const todo = require('./todo')
const project = require('./project')

route.use('/users', user)
route.use('/todos', todo)
route.use('/projects', project)

module.exports = route