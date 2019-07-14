const express = require('express');
const routes = express.Router()
const { ControllerUser, ControllerTodo } = require('../controllers/index.js')
const verifyToken = require('../middlewares/verify');

routes.post('/register', ControllerUser.create)
routes.post('/signin', ControllerUser.signin)
routes.post('/signin-google', ControllerUser.googleSignIn)
routes.get('/dashboard', verifyToken, ControllerUser.getInfo)

module.exports = routes