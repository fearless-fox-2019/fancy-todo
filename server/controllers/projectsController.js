const projectModel = require('../models/projectModel')
const todoListModel = require('../models/todoListModel')
const taskModel = require('../models/taskModel')

class projectController {
    static getIncluded(req, res, next) {
        let userId = req.decode.userId
        projectModel
            .find()
            .populate('members')
            .then((allProjects) => {
                let memberOf = []
                allProjects.forEach((project, i) => {
                    project.members.forEach((member, i) => {
                        console.log(member, 'ini member ke ', i)
                        if (member._id == userId) {
                            memberOf.push(project)
                        }
                    })
                })
                res.status(200).json({
                    memberOf
                })
            })
            .catch(next)
    }
    static getAll(req, res, next) {
        projectModel
            .find()
            .populate('members')
            .then((allProjects) => {
                res.status(200).json(allProjects)
            })
            .catch(next)
    }
    static create(req, res, next) {
        let creator = req.decode.userId
        let members = [creator]
        let {
            name,
            description
        } = req.body
        let newProject = {
            name,
            description,
            creator,
            members
        }

        projectModel
            .create(newProject)
            .then((created) => {
                console.log(created)
                res.status(201).json(created)
            })
            .catch(next)
    }

    static get(req, res, next) {
        let projectId = req.params.projectId

        projectModel
            .findById(projectId)
            .populate('members')
            .then(result => {
                res.json(result)
            })
            .catch(next)
    }
    static update(req, res, next) {
        let projectId = req.params.projectId
        let {
            name,
            description
        } = req.body

        projectModel
            .findById(projectId)
            .then((foundProject) => {
                if (name) {
                    foundProject.name = name
                }
                if (description) {
                    foundProject.description = description
                }
                let updatedProject = new projectModel(foundProject)
                return updatedProject.save()
            })
            .then((updated => {
                console.log(updated)
                res.status(200).json(updated)
            }))
            .catch(next)
    }
    static addMember(req, res, next) {
        console.log('==-=-=-=-=- ehehe')
        let projectId = req.params.projectId
        let newMember = req.body.memberId
        console.log(projectId, newMember)
        projectModel
            .findById(projectId)
            .then((foundProject) => {
                //kasih validasi kalo member tersebut udah menjadi member maka tak bisa di invite lagi
                console.log(foundProject)
                foundProject.members.push(newMember)
                console.log(foundProject)
                let updateProject = new projectModel(foundProject)

                return updateProject.save()
            })
            .then((updated) => {
                res.status(200).json(updated)
            })
            .catch(next)
    }
    static removeMember(req, res, next) {
        let projectId = req.params.projectId
        let memberId = req.body.memberId
        console.log(memberId)
        projectModel
            .findById(projectId)
            .then((foundProject) => {
                console.log(foundProject, '<== before')
                let left = []
                foundProject.members.forEach(member => {
                    if (member != memberId) {
                        left.push(member)
                    }
                })
                foundProject.members = left
                let update = new projectModel(foundProject)

                return update.save()
            })
            .then((updated) => {
                res.status(200).json(updated)
            })
            .catch(next)
    }
    static delete(req, res, next) {
        let projectId = req.params.projectId
        let arrayOfList = []

        todoListModel
            .find({
                projectId
            })
            .then((founds) => {
                founds.forEach(found => {
                    arrayOfList.push(found._id)
                })
                return todoListModel.deleteMany({
                    projectId
                })
            })
            .then(() => {
                return taskModel.deleteMany({
                    listId: {
                        $in: arrayOfList
                    }
                })
            })
            .then(() => {
                return projectModel.findByIdAndDelete(projectId)
            })
            .then((deleted) => {
                res.status(200).json(deleted)
            })
            .catch(next)
    }
}

module.exports = projectController