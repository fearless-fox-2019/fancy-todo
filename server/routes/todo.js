const express = require('express');
const Router = express.Router();
const todoController = require('../controllers/todoCon')
const { Authentication, Authorization } = require('../middlewares/auth')

Router.use(Authentication)
Router.get('/', todoController.list)
Router.get('/:id', todoController.searchById)
Router.post('/', todoController.create)
Router.patch('/:id', Authorization, todoController.update)
Router.delete('/:id', Authorization, todoController.delete)

module.exports = Router;