const Project = require('../models/project')
const Todo = require('../models/todo')
const User= require('../models/user')
const sendEmail= require('../helpers/nodemailer')

class projectController{

    static create(req, res, next){
        let {name, description} = req.body
        // console.log(req.body['members[]'], '=======')

        let newProject={
            name: name,
            description: description,
            creator: req.decode.id,
            members:req.body['members[]']
        }

        Project.create(newProject)
        .then(project =>{

            // Send Email Notification
            let members= project.members

            members.forEach(member => {
                User.findById(member)
                .then(user => {
                    if(user){
                        console.log(creator, 'ini data creator')
                        let subject='Project Invitation for Trail Work'
                        let textToSend = `
                                <h2> Hello ${user.name} </h2>
                                <p> You have been invited to colarobate on project ${project.name}</p>
                                <p> Checkout to our apps to check your project. <span><a href="${process.env.CLIENT_URL}"> Go To Trail Work <a> </span></p><br>
                                <p> Happy working and have a great day!</p>
                                <br><hr>
                                <h4>Sincerely, </h4>
                                <h4>Trail Work Team</h4>
                                                    
                            `
                        sendEmail(user.email, subject, textToSend)
                    }
                })
                .catch(next)
            });
            res.status(201).json(project)
        })
        .catch(next)
    }

    static findAll(req, res, next){
        Project.find({})
        .populate('creator')
        .then(data =>{
            let projects=[]
            data.forEach(project =>{                
                if(project.members.includes(req.decode.id)){

                      projects.push(project)
                    }
            })
            
            res.status(200).json(projects)
        })
        .catch(next)
    }

    static findOne(req, res, next){
        Project.findById(req.params.projectId)
        // .populate('members')
        .then(project =>{
            res.status(200).json(project)
        })
        .catch(next)
    }

    static update(req, res, next){
        // console.log(req.body)
        let {name, description}= req.body
        let members= req.body['members[]']

        Project.findByIdAndUpdate(req.params.projectId, {$set: {name: name, description: description, members: members}},{new: true})
        .then(project =>{
            res.status(200).json(project)
        })
        .catch(next)
    }

    static addMember(req, res, next){

        Project.findById(req.params.projectId)
        .then(project =>{
            let members= req.body['members[]']
            let invitedMember= []

            members.forEach(member =>{
                if(project.members.indexOf(member)== -1){
                    invitedMember.push(member)
                }
            })

            // Send Email to Invited Member
            invitedMember.forEach(el =>{
                User.findById(el)
                .then(user =>{
                    let subject='Project Invitation for Trail Work'
                    let textToSend = `
                            <h2> Hello ${user.name} </h2>
                            <p> You have been invited to colarobate on project ${project.name}</p>
                            <p> Checkout to our apps to check your project. <span><a href="${process.env.CLIENT_URL}"> Go To Trail Work <a> </span></p><br>
                            <p> Happy working and have a great day!</p>
                            <br><hr>
                            <h4>Sincerely, </h4>
                            <h4>Trail Work Team</h4>
                                                
                        `
                    sendEmail(user.email, subject, textToSend)
                })
                .catch(next)
            })
            project.members=members
            return project.save()

        })
        .then(success =>{
            res.status(200).json(success)
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
}

module.exports= projectController