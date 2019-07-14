const Project = require('../models/project')
const User = require('../models/user')
const Todo = require('../models/todo')

class ProjectController {

    static async create(req, res, next){
        try {

            let { name, todos } = req.body

            let data = await Project.create({
                name,
                todos : [todos],
                fix_members : [req.loggedUser._id]
            })

            res.status(201).json(data)

        } catch (error) {
            
            next(error)

        }
    }

    static async createTodoProject(req, res, next){
        try {
            
            let {name, description, dueDate} = req.body

            let projectId = req.params.id

            let todo = await Todo.create({
                name, description, dueDate,
                userId : req.loggedUser._id,
                isProject : true
            })

            let updateProject = await Project.findByIdAndUpdate(projectId, {
                $push : { todos : todo._id}
            }, {new : true})
            
            console.log('updateProject: ', updateProject);

            res.status(201).json(todo)

        } catch (error) {
            next(error)
        }
    }
    
    static async inviteMember(req, res, next){
        try {
            
            let { userId } = req.body
            let projectId = req.params.id

            let project = await Project.findById(projectId)

            let flag = true

            for(let i = 0; i < project.pending_members.length; i++){
                console.log(project.pending_members[i].toString() === userId.toString());
                if(project.pending_members[i].toString() === userId.toString()) {
                    flag = false
                    break;
                }
            }

            if(!flag){
                next({code : 400, msg : 'user already invited'})
            } else {

                project.pending_members.push(userId)
    
                let savingProject = await project.save()
    
                let user = await User.findById(userId)
    
                user.notifications.push({
                    projectId : project._id,
                    msg : `${req.loggedUser.username} invite you to project "${project.name}"`
                })
    
                let savingUser = await user.save()
    
                res.json({msg : `${user.username} successfully invited`})
            }

            

        } catch (error) {
            next(error)
        }
    }

    static async rejectInvitation(req, res, next){
        try {
            let projectId = req.params.id
            console.log('projectId: ', projectId);

            let project = await Project.findById(projectId)

            let arr = []

            for(let i = 0; i < project.pending_members.length; i++){
                if(project.pending_members[i].toString() != req.loggedUser._id.toString()){
                    arr.push(project.pending_members[i])
                }
            }

            project.pending_members = arr

            let savingProject = await project.save()

            let user = await User.findById(req.loggedUser._id)

            arr = []

            for(let i = 0; i < user.notifications.length; i++){
                console.log('user.notifications[i].projectId.toString(): ', user.notifications[i].projectId.toString());
                console.log('projectId.toString(): ', projectId.toString());
                if(user.notifications[i].projectId.toString() !== projectId.toString()){
                    arr.push(user.notifications[i])
                }
            }

            user.notifications = arr

            let savingUser = await user.save()

            res.json({ msg : `invitation from project "${project.name}" has been rejected`})

        } catch (error) {
            next(error)
        }
    }

    static async acceptInvitation(req, res, next){

        try {
            
            let projectId = req.params.id

            let project = await Project.findById(projectId)

            let arr = []

            for(let i = 0; i < project.pending_members.length; i++){
                if(project.pending_members[i].toString() !== req.loggedUser._id.toString()){
                    arr.push(project.pending_members[i])
                }
            }

            project.pending_members = arr

            project.fix_members.push(req.loggedUser._id)

            let savingProject = await project.save()

            let user = await User.findById(req.loggedUser._id)

            arr = []

            for(let i = 0; i < user.notifications.length; i++){
                if(user.notifications[i].projectId.toString() !== projectId.toString()) arr.push(user.notifications[i])
            }

            user.notifications = arr

            let savingUser = await user.save()

            res.json({ msg : `invitation from project "${project.name}" has been accepted`})

        } catch (error) {
            next(error)
        }


    }

    static async findAll(req, res, next){
        try {

            let data = await Project.find({
                fix_members : {
                    $in : req.loggedUser._id
                }
            })
                .populate('fix_members')
                .populate('pending_members')
                .populate({
                    path : 'todos',
                    populate : {
                        path : 'userId'
                    }
                })


            res.json(data)

        } catch (error) {
            
            next(error)

        }
    }
    
    static async findOne(req, res, next){
        try {
            
            let data = await Project.findById(req.params.id)
                .populate('fix_members')
                .populate('pending_members')
                .populate('todos')


            res.json(data)

        } catch (error) {
            
            next(error)   

        }
    }
        
    static async deleteProject(req, res, next){
        try {
            
            let project = await Project.findById(req.params.id)

            await Todo.deleteMany({
                _id : {
                    $in : project.todos
                }
            })

            await User.updateMany({},{
                $pull : {
                    'notifications' : {
                        projectId: {

                            $in : req.params.id
                        }
                    }
                }
            })

            let deleteProject = await Project.findByIdAndDelete(req.params.id)

            res.json({message : 'deleted', response : deleteProject})
            
        } catch (error) {
            
            next(error)

        }
    }

    static async deleteTodoProject(req, res, next){
        try {

            let project = await Project.findByIdAndUpdate(req.params.id, {
                $pull: {
                    todos: req.params.todoId
                }
            })
            
            console.log(project)

            let todo = await Todo.findByIdAndDelete(req.params.todoId)
         

            res.json({message : 'deleted', response : todo})

        } catch (error) {
            next(error)
        }
    }

    static async updateTodoProject(req, res, next){

        try {
            let id = req.params.todoId
            let obj = {}
            if (req.body.description) obj.description = req.body.description
            if (req.body.dueDate) obj.dueDate = req.body.dueDate
            if (req.body.status) obj.status = req.body.status
            if (req.body.name) obj.name = req.body.name

            let data = await Todo.findByIdAndUpdate(id, obj)
                
            res.json({ message : 'updated', response : data})
            
        } catch (error) {
            next(error)
        }
       
                
        
    }
}

module.exports = ProjectController