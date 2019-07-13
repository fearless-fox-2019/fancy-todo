const express = require('express');
const routes = express.Router()
const { ControllerUser, ControllerTodo } = require('../controllers/index.js')


routes.post('/register', ControllerUser.create)
routes.post('/signin', ControllerUser.signin)
routes.post('/dashboard', ControllerUser.getInfo)


module.exports = routes