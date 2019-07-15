const Todo= require('../models/todo')
const Project= require('../models/project')
const User= require('../models/user')
const countDay= require('../helpers/countDay')
const sendEmail= require('../helpers/nodemailer')
const CronJob = require('cron').CronJob

new CronJob('30 22 * * * *', function() {

    User.find({})
    .then(users =>{
        
        users.forEach(user=>{

             todoController.getDeadline(user._id)
             .then(data =>{
                // console.log(data, '=====')
                if(data.todos.length>0){
                    let subject="Reminder Tommorow's Deadline Todos"
                    let textToSend=`<html>
                    <style>
                        table, th, td {
                        padding: 10px;
                        border: 1px solid black; 
                        }
                    </style>
                    <body>
                    <h2>Good Night ${data.user.name},</h2>
                    <h4>Don't forget to do your task!</h4>
                    <h4>This is your task with tommorrow's deadline:</h4>
                    <table>
                        <tr>
                            <th>No</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Project</th>
                        </tr>
                    `
        
                for (let i = 0; i < data.todos.length; i++) {
                    
                    
                    if(i== data.todos.length-1){
                        if(data.todos[i].projectId){
                            // console.log(data.todos[i].projectId, 'projectId');
                            textToSend+=`
                            <tr>
                                <td>${i+1}</td>
                                <td>${data.todos[i].name}</td>
                                <td>${data.todos[i].description}</td>
                                <td>${data.todos[i].projectId.name}</td>
                            </tr>
                            </table>
                            <hr>
                            <h5>Warm Regards,</h5>
                            <h5>Trail Work Team</h5>
                            </body>
                            </html>
                                `
                        }else{
                            textToSend+=`
                            <tr>
                                <td>${i+1}</td>
                                <td>${data.todos[i].name}</td>
                                <td>${data.todos[i].description}</td>
                                <td>-</td>
                            </tr>
                            </table>
                            <hr>
                            <h5>Warm Regards,</h5>
                            <h5>Trail Work Team</h5>
                            </body>
                            </html>
                                `
                        }
                    }else{
                        if(data.todos[i].projectId){
                            textToSend+=`
                            <tr>
                                <td>${i+1}</td>
                                <td>${data.todos[i].name}</td>
                                <td>${data.todos[i].description}</td>
                                <td>${data.todos[i].projectId.name}</td>
                            </tr>
                                `
                        }else{
                            textToSend+=`
                            <tr>
                                <td>${i+1}</td>
                                <td>${data.todos[i].name}</td>
                                <td>${data.todos[i].description}</td>
                                <td>-</td>
                            </tr>
                                `
                        }
                    }
                    
                }
                // console.log(textToSend);
                
                sendEmail(data.user.email, subject, textToSend)
                
                }
            })
            .catch(err =>{
                console.log('error cron get Deadline');
                console.log(err);
                
            })
             
                })
                
    })
    .catch(err =>{
        console.log('error cron get user');
        console.log(err);
        
    })
    

  }, null, true, 'Asia/Singapore');

class todoController{

    static create(req,res, next){
        let {name, description, dueDate, type, projectId}= req.body
        console.log(req.body, 'req.body')
        let newTodo= {
            name: name,
            description: description,
            type: type,
            dueDate: dueDate,
            userId: req.decode.id,
            projectId: projectId
        }
        
        Todo.create(newTodo)
        .then(todo =>{
            res.status(201).json(todo)
        })
        .catch(next)
    }

    static findAll(req, res, next){
        Todo.find({status: req.params.status, projectId: req.params.projectId})
        .populate('projectId')
        .populate('userId')
        .sort({dueDate: -1})
        .then(todos =>{
            res.status(200).json(todos)
        })
        .catch(next)
    }

    static findMyTodo(req, res, next){
            
        Todo.find({status: req.params.status, userId: req.decode.id, type: 'personal'})
        .sort({dueDate: -1})
        .then(todos =>{
            res.status(200).json(todos)
        })
        .catch(next)
    }

    static findOne(req, res, next){
        Todo.findById(req.params.todoId)
        .populate('userId')
        .populate('projectId')
        .then(todo =>{
            res.status(200).json(todo)
        })
        .catch(next)
    }

    static async getDeadline(id){

        try {
            let data=[]

                let user= await User.findById(id)

                let personal= await Todo.find({status: 'todo', userId: id, type: 'personal'}).sort({dueDate: -1})
    
                personal.forEach(todo => {
                    let day= countDay(new Date, todo.dueDate)
                    if(day == 1){
                        data.push(todo)
                    }
                })
    
                let projects= await Project.find({
                    members: {$in: id}
                })

                let projectsId= []

                projects.forEach(project =>{
                    projectsId.push(project._id)
                })
                
                let projectTodo= await Todo.find({
                    projectId: {$in: projectsId}
                }).populate('projectId')

                projectTodo.forEach(todo => {
                    let day= countDay(new Date, todo.dueDate)
                    if(day == 1 && todo.status == 'todo'){
                        data.push(todo)
                    }
                })



                let result={
                    user: user,
                    todos: data
                }

                return result

    
            
        } catch (error) {
            console.log(error);
            
        }



    }

    static update(req, res, next){
        console.log(req.body)
        Todo.findByIdAndUpdate(req.params.todoId, {$set: { ...req.body }},{new: true})
        .then(todo =>{
            res.status(200).json(todo)
        })
        .catch(next)
    }

    static remove(req, res, next){
        console.log(req.params.todoId);
        
        Todo.findById(req.params.todoId)
        .then(todo=>{
            if(todo){
                Todo.deleteOne({_id: todo._id})
                .then(() =>{
                    res.status(200).json({todo})
                })
                .catch(next)

            }else{
                throw {code: 404, message: 'Todo not found!'}
            }
        })
        .catch(next)
    }
}

module.exports= todoController