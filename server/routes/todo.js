const express = require('express');
const route = express.Router();
const todoController = require('../controllers/todoController');
const { authorization } = require('../middlewares/auth');

route.get('/', todoController.todoList);
route.get('/:id', todoController.oneTodo);
route.post('/', todoController.addTodo);
route.patch('/:id', authorization, todoController.updateTodo);
route.delete('/:id', authorization, todoController.deleteTodo);

module.exports = route;
