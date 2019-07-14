const express = require('express');
const routes = express.Router()
const user = require('./user');
const { ControllerTodo } = require('../controllers/index')
const verifyToken = require('../middlewares/verify');

routes.post('/create', verifyToken, ControllerTodo.create)
routes.get('/all', verifyToken, ControllerTodo.getAll)
routes.get('/pending', verifyToken, ControllerTodo.getPending)
routes.get('/completed', verifyToken, ControllerTodo.getComplete)
routes.patch('/complete', verifyToken, ControllerTodo.updateTask)
routes.delete('/delete', verifyToken, ControllerTodo.deleteTask)
routes.get('/find', verifyToken, ControllerTodo.findTask)

module.exports = routes