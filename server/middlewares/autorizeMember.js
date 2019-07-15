const Project = require('../models/projects')
const Todo = require('../models/todos')

module.exports = {
  byTodoId: (req, res, next) => {
    Todo.findById(req.params.todoId)
    .then(todo => {
      if(todo) {
        let userProject = req.loggedUser.projects
        let found = false
        for(let i in userProject) {
          if(userProject[i] == todo.project) {
            found = true
          }
        }
        if(found) {
          next()
        } else {
          next({status: 403, message: 'Member Only !'})
        }
      } else next({status: 401, message: 'todo not found, from authorization'})
    })
    .catch(next)
  },

  byProjectId: (req, res, next) => {
    Project.findById(req.params.projectId)
    .then(project => {
      if(project) {
        if(project.members.includes(req.loggedUser._id)) {
          next()
        } else next({status: 400, message: 'Member only !'})
      } else next({status: 400, message: 'project not found, from authorization'})
    })
    .catch(next)
  },

  authOwner: (req, res, next) => {
    Project.findById(req.params.projectId)
    .then(project => {
      if(project) {
        if(project.owner == req.loggedUser._id) {
          next()
        } else next({status: 401, message: 'Owner only !'})
      } else next({status: 400, message: 'Project not found, from authorization'})
    })
    .catch(next)
  }
}

