const express = require('express')
const router = express.Router()
const users = require('./user')
const todos = require('./todo')
const UserController = require('../controllers/userController')


router.use('/users', users)
router.use('/todos', todos)
router.post('/g-signin', UserController.googleSignin)


module.exports = router