const Project = require("../models/project")
const Todo = require("../models/todo")
const User = require("../models/user")

class ProjectController {
    
    static createProject (req, res, next) {
        var projectData = null
        var newProject = new Project({
            name: req.body.name,
            members: [req.headers.decoded._id],
            todos: []
        })
        newProject.save()
        .then(project =>{
            projectData = project
            return User.findOne({_id: req.headers.decoded._id})
        })
        .then(user =>{
            user.projects.push(projectData._id)
            return user.save()
        })
        .then(user =>{
            return Project.findOne({_id: projectData._id}).populate("members").populate("todos")
        })
        .then(project =>{
            res.status(201).json(project)
        })
        .catch(next)
    }

    static viewProject (req, res, next) {
        Project.findOne({_id: req.params.id}).populate("members").populate("todos")
        .then(project =>{
            res.status(200).json(project)
        })
        .catch(next)
    } 

    static inviteMembers (req, res, next) {
        var projectData = null
        Project.findOne({_id: req.params.id})
        .then(project =>{
            if(req.body.member){
                if(project.members.includes(req.body.member)) {
                    throw({
                        code: 400,
                        message: "Selected User is already a Member in this project"
                    })
                } else {
                    project.members.push(req.body.member)
                    return project.save()
                }
            } else {
                throw({
                    code: 400,
                    message: "No user is selected"
                })
            }
        })
        .then(project =>{
            projectData = project
            return User.findOne({_id: req.body.member})
        })
        .then(user =>{
            user.projects.push(projectData._id)
            return user.save()
        })
        .then(user =>{
            return Project.findOne({_id: projectData._id}).populate("members").populate("todos")
        })
        .then(project =>{
            res.status(200).json(project)
        })
        .catch(next)
    }    

    static deleteProject (req, res, next) {
        Project.findOne({_id: req.params.id})
        .then(project =>{
            if(!project) {
                throw ({
                    code: 404,
                    message: "Project does not exist"
                })
            }
            return project.remove()
        })
        .then(removed =>{
            res.status(200).json(removed)
        })
        .catch(next)
    }

    static createTodo (req, res, next) {
        var temp = null
        var newTodo = new Todo ({
            name: req.body.name,
            category: req.body.category,
            status: false,
            project: req.params.id
        })
        newTodo.save()
        .then(todo =>{
            temp = todo
            return Project.findOne({_id: req.params.id}).populate("members").populate("todos")
        })
        .then(project =>{
           project.todos.push(temp._id)
           return project.save() 
        })
        .then(updatedProject =>{
            return Project.findOne({_id: updatedProject._id}).populate("members").populate("todos")
        })
        .then(project =>{
            res.status(200).json(project)
        })
        .catch(next)
    }

    static updateTodo (req, res, next) {
        Todo.findOne({_id: req.body.todo})
        .then(todo =>{
            todo.status = req.body.todoStatus
            return todo.save()
        })
        .then(todo =>{
            res.status(200).json(todo)
        })
        .catch(next)
    }

    static deleteTodo (req, res, next) {
        var todoData = null
        Todo.findOne({_id: req.body.todo})
        .then(todo =>{
            if(!todo) {
                throw({
                    code: 404,
                    message: "Todo not found"
                })
            }
            todoData = todo
            return todo.remove()
        })
        .then(removed =>{
            return Project.findOne({_id: req.params.id})
        })
        .then(project =>{
            var index = project.todos.indexOf(todoData._id)
            project.todos.splice(index, 1)
            return project.save()
        })
        .then(project =>{
            return Project.findOne({_id: project._id}).populate("members").populate("todos")
        })
        .then(project =>{
            res.status(200).json(project)
        })
        .catch(next)
    }



}

module.exports = ProjectController