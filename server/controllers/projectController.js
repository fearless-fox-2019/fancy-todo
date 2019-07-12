const Project = require('../models/project')
const Todo = require('../models/todo')
const User= require('../models/user')

class projectController{

    static create(req, res, next){
        let {name, description} = req.body
        console.log(req.body['members[]'], '=======')
        let newProject={
            name: name,
            description: description,
            creator: req.decode.id,
            members:req.body['members[]'],
            todoList:[]
        }
        Project.create(newProject)
        .then(project =>{
            res.status(201).json(project)
        })
        .catch(next)
    }

    static findAll(req, res, next){
        Project.find({})
        .populate('members')
        .populate('todoList')
        .then(data =>{
            let projects=[]
            data.forEach(element =>{
                if(element.members.includes(req.decode.id)){
                    projects.push(element)
                }
            })
            res.status(200).json(projects)
        })
        .catch(next)
    }

    static findOne(req, res, next){
        Project.findById(req.params.projectId)
        .populate('members')
        .populate('todoList')
        .then(project =>{
            res.status(200).json(project)
        })
        .catch(next)
    }

    static update(req, res, next){
        Project.findByIdAndUpdate(req.params.projectId, {$set: { ...req.body }})
        .then(project =>{
            res.status(200).json(project)
        })
        .catch(next)
    }

    static remove(req, res, next){
        Promise.all([
            Todo.deleteMany({projectId: req.params.projectId}),
            Project.deleteOne({_id: req.params.projectId})
        ])
        .then(data =>{
            res.status(200).json(data)
        })
        .catch(next)
    }

    static async inviteMember(req, res, next){

        try {
            let user= await User.findOne({email: req.body.email})
            let project= await Project.findById(req.params.projectId)

            if(project.members.indexOf(user._id) < 0){
                project.members.push(user._id)
                await project.save()

            }else{
                throw {code: 400, message: 'Already member!'}
            }
            
        } catch (next) {
 
        }
    }
}

module.exports= projectController