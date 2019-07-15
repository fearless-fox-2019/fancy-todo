const User = require('../models/user')
const Project = require('../models/project')

class Controller {
    static findAll(req, res, next) {   
        Project.find({members:req.decoded.email})
        .populate('members')
        .then( (Projects) =>{
            res.status(200).json(Projects)
        })
        .catch(next)
    }

    static findOne(req, res, next) {
        Project.findById(req.params.projectId)
        .populate('todos')
        .populate('members')
        .then( (project) =>{
            if (project) {
                res.status(200).json(project)
            } else {
                next({
                    code: 404,
                    message: 'Project not found'
                })
            }
        })
        .catch(next)
    }

    static delete(req, res, next) {
        Project
            .findByIdAndDelete(req.params.projectId)
            .populate('members')
            .then( (deleted) => {
                if (deleted) {
                    res.status(200).json({
                        message: 'Successfully deleted',
                        info: deleted
                    })
                } else {
                    next({
                        code: 404,
                        message: 'Project not found'
                    })
                }
            })
            .catch(next)
    }

    static update(req,res, next){
        const information = {}
        for (var key in req.body) {
            if (key === 'name') {
                information[key] = req.body[key]
            }
        }
        Project.findById(req.params.projectId)
        .then( (project) =>{
            project.set(information)
            return project.save()
        })
        .then( (updated) =>{
            res.status(200).json(updated)
        })
        .catch(next)
    }

    static addMember(req, res, next){
        Project.findOne({ 
            _id: req.params.projectId, 
            members: req.params.userId
        })
        .then( (project) => {
            console.log
            if (project) {
                next({
                    code: 400,
                    message: 'Cannot registering same member twice'
                })
            } else {
                Project
                .findByIdAndUpdate(req.params.projectId,
                    {$push:
                        {members: req.params.userId}
                    },
                    {new:true}
                )
                .populate('members')
                .then( (updated) => {
                    res.status(200).json(updated)
                })
                .catch(next)
            }
        })
        .catch(next)
    }

    static deleteMember(req, res, next){
        Project
            .findByIdAndUpdate(req.params.projectId,
                {$pull:
                    {
                        members:req.params.userId
                    }
                },
                {new:true}
            )
            .populate('members')
            .then( (updated) => {
                res.status(200).json(updated)
            })
            .catch(next)
    }

    static create(req, res, next){
        let infomembers  = req.body[`members[]`]
        console.log(infomembers, 'infomembers')
        let members = [req.decoded.id]
        let promises = []
        for( let i = 0 ; i < infomembers.length; i++){
            promises.push(
                User.findOne({
                    email: infomembers[i]
                })
            )
        }
        Promise.all(promises)
        .then( (users) =>{
            console.log(users)
            users.forEach( (user) => {
                if(user){
                    members.push(user._id)
                }
            });
            let { name } = req.body
            let objInput = {
                name,
                admin: req.decoded.id,
                members: members
            }
            console.log(objInput)
            console.log('here')
            return Project.create(objInput)
        })
        .then( (project) =>{
            console.log(project)
            res.status(200).json({
                message: 'Project successfully created',
                info: project
            })
        })
        .catch(next)
    }
}

module.exports = Controller