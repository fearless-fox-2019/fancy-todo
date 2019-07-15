const Project = require('../models/projects')
const User = require('../models/users')
const saveMany = require('../helpers/saveMany')
class ControllerProject {

  static findAll (req, res, next) {
    Project.find({members: {$in: [req.loggedUser._id]}})
    .populate('members', 'email')
    .populate('owner', 'email')
    .populate('todos', 'name')
    .then(result => {
      res.status(200).json(result)
    })
    .catch(next)
  } 
  static create (req, res, next)  {
    let {name} = req.body
    let resultCreate
    let input = {
      name,
      owner: req.loggedUser._id,
      members: [req.loggedUser._id]
    }
    Project.create(input)
    .then(result => {
      resultCreate = result
      return saveMany([req.loggedUser._id], result._id)
    })
    .then(resultSave => {
      res.status(201).json({resultCreate, resultSave})
    })
    .catch(next)
  }

  static addMember (req, res, next) {
    let {users} = req.body
    let newMembers
    let resultAdd
    if(Array.isArray(users)) {
      newMembers = users
    } else {
      newMembers = [users]
    }
    Project.findById(req.params.projectId)
    .then(project => {
      if(project) {
        for(let i in newMembers) {
          if(project.members.includes(newMembers[i])) {
            throw {status: 409, message: `One of the user is already a member in this project !`}
          }
        }
        project.members.push(...newMembers)
        return project.save()
      } else throw {status : 400, message: 'Project not found'}
    })
    .then(result => {
      resultAdd = result
      return saveMany(newMembers, req.params.projectId)
    })
    .then(resultSave => {
      res.status(201).json({resultAdd, resultSave})
    })
    .catch(next) 
  }

  static delete (req, res, next) {
    Project.findById(req.params.projectId)
    .then(project => {
      return project.remove()
    })
    .then(result => {
      res.status(200).json(result)
    })
    .catch(next)
  }

  static kickMember (req, res, next) {
    let {user} = req.body
    let input = user
    let resultProject
    Project.findById(req.params.projectId)
    .then(project => {
      if(project) {
        let filter = project.members.filter(member => member != input)
        project.members = filter
        return project.save()
      } else throw {status: 400, message: 'project not found'}
    })
    .then(project => {
      resultProject = project
      return User.findById(input)
    })
    .then(kickedUser => {
      let index = kickedUser.projects.indexOf(req.params.projectId)
      kickedUser.projects.splice(index, 1)
      return kickedUser.save()
    })
    .then(resultSave => {
      res.status(200).json({resultProject, resultSave})
    })
    .catch(next)
  }

  static editName (req, res, next) {
    let newName = req.body.name
    Project.findById(req.params.projectId)
    .then(project => {
      if(project) {
        project.name = newName
        return project.save()
      } else {throw {status: 400, message: 'Project not found'}}
    })
    .then(result => {
      res.status(200).json(result)
    })
    .catch(next)
  }
}

module.exports = ControllerProject