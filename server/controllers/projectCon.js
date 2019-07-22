const { decoded } = require('../helpers/jwt')
const nodemailer = require("nodemailer");
const Project = require('../models/project')
const Todo = require('../models/todo')
const User = require('../models/user')

class ProjectController {
    static create(req, res, next) {
        let token = decoded(req.headers.access_token)
        let obj = {
            name: req.body.name
        }
        Project.create(obj)
        .then(data => {
            return Project.findByIdAndUpdate(data.id,
                {$push:
                    {members: token.id}
                },
                {new:true}
            )
            .then( updated => {
                res.status(200).json(updated)
            })
        })
        .then(data => {
            console.log('success create new project');
        })
        .catch(next)
    }

    static findUserNotMember(req, res, next){
        Project.findById(req.params.id)
        .then(data => {
            if (!data) next({ message: 'Todo Not Found' })
                else {
                    User.find({ _id: {$nin : data.members}})
                    .then(user => {
                        res.status(200).json(user)
                    })
                    .catch(err => {
                        console.log(err)
                    })                        
                }
        }) 
        .catch(next)
    }

    static findAllByMembers(req, res, next) {
        let token = decoded(req.headers.access_token)
        Project.find().populate('members').populate('todos')
        .then(data => {
            let projects = []
            for (let i = 0; i < data.length; i++) {
                for (let j = 0; j < data[i].members.length; j++) {
                    if (data[i].members[j]._id == token.id) {
                        projects.push(data[i])
                    }
                }
            }
            res.status(200).json(projects)
        })
        .catch(next)
    }

    static findById(req, res, next) {
        Project.findById(req.params.id).populate('members').populate('todos')
        .then(data => {
            if (!data) next({ message: 'Todo Not Found' })
                else res.status(200).json(data)
        }) 
        .catch(next)
    }

    static update(req, res, next) {
        let obj = {
            name: req.body.name
        }
        Project.findOne({_id : req.params.id})
        .then(data => {
            if (!data) next({ code: 404, resource: 'Project' })
            else {
                data.set(obj)
                return data.save()                    
            }
        }) 
        .catch(next)
    }

    static addMember(req, res, next) {
        Project.findOne({_id : req.params.id})
        .then(data => {
            if (!data) next({ code: 404, resource: 'Project' })
            else {
                return Project.findByIdAndUpdate(data.id,
                    {$push:
                        {members: req.params.userId}
                    },
                    {new:true}
                )
                .then( updated => {
                    res.status(200).json(updated)
                })                 
            }
        }) 
        .then(data =>{
            console.log('Success add user to project')
        })
        .catch(next)
    }

    static addTodo(req, res, next) {
        Project.findOne({_id : req.params.id})
        .then(data => {
            if (!data) next({ code: 404, resource: 'Project' })
            else {
                return Project.findByIdAndUpdate(data.id,
                    {$push:
                        {todos: req.params.todoId}
                    },
                    {new:true}
                )
                .then( updated => {
                    res.status(200).json(updated)
                })                 
            }
        }) 
        .then(data =>{
            console.log('Success add todo to project')
        })
        .catch(next)
    }

    static deleteTodo(req, res, next) {
        Project.findOne({_id : req.params.id})
        .then(data => {
            if (!data) next({ code: 404, resource: 'Project' })
            else {
                return Project.findByIdAndUpdate(data.id,
                    {$pull:
                        {todos: req.params.todoId}
                    },
                    {new:true}
                )
                .then( updated => {
                    res.status(200).json(updated)
                })                 
            }
        }) 
        .then(data =>{
            console.log('Success add todo to project')
        })
        .catch(next)
    }

    static sendEmail(req, res, next) {
        let invitingUser = decoded(req.headers.access_token)
        Project.findById(req.params.id)
        .then(data => {
            if (!data) next({ message: 'Todo Not Found' })
                else {
                    const transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: `fancy.todo7@gmail.com`,
                            pass: `hacktiv8`
                        }
                    })

                    const emailCont = `
                    <h2> Todo List </h2>
                    <hr>
                    ${invitingUser.name} wants you to join ${data.name}, 
                    to accept the invitation please click link below :
                    <a id="accept" href="http://localhost:8080"> Click Here </a>
                    <script>
                    $('#accept').click(function (event) {
                        event.preventDefault()
                        return $.ajax({
                            url: 'http://34.87.76.86/projects/member/${req.params.id}/${req.params.userId}'
                            type: 'PATCH'
                        })
                        .done(function (data) {
                            console.log('Success add member to project')
                        })
                        .fail(function (err) {
                            res.status(10).json(err)
                        })
                    }
                    </script>
                    `

                    let emailDestination

                    User.findById(req.params.id)
                    .then(user => {
                        if (!user) next({ message: 'Todo Not Found' })
                            else {
                                emailDestination = user.email
                            }
                    }) 
                    .catch(next)


                    const mailOptions = {
                        from: 'admin@todolist.com', // sender address
                        to: emailDestination, // list of receivers
                        subject: 'Invitational to join project', // Subject line
                        html: emailCont
                    };
            
                    transporter.sendMail(mailOptions, function (err, info) {
                        if(err){
                            console.log(err);
                        } else {
                            console.log(info);
                        }
                    })
                }
        }) 
        .catch(next)
    }

    static delete(req, res, next) {
        Project.findById(req.params.id)
        .then(data => {
            if (data.todos.length < 1) {
                Project.findByIdAndDelete(req.params.id)
                .then(data => {
                    if (!data) next({ code: 404, resource: 'Project' })
                        else res.status(200).json(req.params.id)
                })
                .catch(next)
            } else {
                Project.findByIdAndDelete(req.params.id)
                .then(data => {
                    for (let i = 0; i < data.todos.length; i++) {
                        Todo.findByIdAndDelete({ _id : data.todos[i]})
                        .then(datas => {
                            console.log(datas)
                        })
                        .catch(next)
                    }
                    res.status(200).json(req.params.id)
                }) 
                .catch(next)
            }
        })
        .catch(next)
    }
}

module.exports = ProjectController