const express = require('express');
const routes = express.Router()
const user = require('./user');
const todo = require('./todo');

routes.use('/users', user)
// routes.get('/todos', todo)

module.exports = routes