const express = require('express');
const Router = express.Router();
const todoRoutes = require('./todo');
const userRoutes = require('./user');
const projectRoutes = require('./project');

// Resource routes
Router.use('/users', userRoutes);
Router.use('/todos', todoRoutes);
Router.use('/projects', projectRoutes);

module.exports = Router;