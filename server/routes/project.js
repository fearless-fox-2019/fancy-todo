const express = require('express');
const Router = express.Router();
const projectController = require('../controllers/projectCon')
const { Authentication, Authorization } = require('../middlewares/auth')

Router.patch('/member/:id/:userId', projectController.addMember)

Router.use(Authentication)
Router.post('/', projectController.create)
Router.get('/', projectController.findAllByMembers)
Router.get('/:id', projectController.findById)
Router.get('/user/:id', projectController.findUserNotMember)
Router.patch('/edit/:id', projectController.update)
Router.patch('/todo/:id/:todoId', projectController.addTodo)
Router.patch('/delete/:id/:todoId', projectController.deleteTodo)
Router.post('/email/:id/:userId', projectController.sendEmail)
Router.delete('/:id', projectController.delete)

module.exports = Router;