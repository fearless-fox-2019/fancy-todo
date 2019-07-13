const express = require('express');
const route = express.Router();
const projectController = require('../controllers/projectController');
const { projectAuth, projectMasterAuth } = require('../middlewares/auth');

route.get('/', projectController.myProjects);
route.post('/', projectController.create);
route.get('/:id', projectAuth, projectController.projectDetail);
route.put('/:id/add-todo', projectAuth, projectController.addTodo);
route.put('/:id/add-member', projectAuth, projectController.asignMember);
route.patch('/:id/:todoId', projectAuth, projectController.updateTodo);
route.delete('/:id/:todoId', projectAuth, projectController.removeTodo);
route.delete('/:id/:memberId', projectMasterAuth, projectController.unasignMember);
route.delete('/:id', projectMasterAuth, projectController.deleteProject);

module.exports = route;
