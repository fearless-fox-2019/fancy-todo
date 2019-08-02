const express = require('express')
const route = express.Router()
const userController = require('../controllers/userController')

route.post('/register', userController.register)
route.post('/login', userController.login)
route.post('/google-login', userController.googleLogin)

module.exports = route