const Project = require('../models/project')
const User = require('../models/user')
const Todo = require('../models/todo')
const mailer = require('../helpers/sendEmail')


class projectController {
    static fetchMine(req, res, next) {
        Project.find({ user_id: req.decoded.id })
            .then((data) => {
                console.log(data);

                res.status(200).json(data)
            })
            .catch(next)
    }

    static fetchCollab(req, res, next) {
        Project.find({
            members: {
                $in: req.decoded.id
            }
        })
            .then((data) => {
                res.status(200).json(data)
            })
            .catch(next)
    }

    static fetchDetail(req, res, next) {
        Project.findOne({ _id: req.params.id }).populate('members').populate('todos').populate('user_id')
            .then((data) => {
                res.status(200).json(data)
            })
            .catch(next)
    }

    static findOneProject(req,res,next){
        Project.findOne({_id: req.params.id})
        .then((data) => {
            res.status(200).json(data)
        })
        .catch(next)
    }

    static addMember(req, res, next) {
        Project.updateOne({ _id: req.params.id },
            {
                $push: {
                    members: req.body.userid
                }
            })
            .then((data) => {
                res.status(200).json(data)
            })
            .catch(next)
    }

    static sendEMailto(req,res,next){
        Project.findById(req.params.id)
        .then((data) => {
            mailer.sendEmail(req.params.email,data.name,req.decoded.email)
            console.log('masuk email');
        })
        .catch(next)
    }

    static deleteMember(req, res, next) {
        Project.updateOne({ _id: req.params.id },
            {
                $pull: {
                    members: req.body.userid
                }
            })
            .then((data) => {
                res.status(200).json(data)
            })
            .catch(next)
    }

    static createProject(req, res, next) {
        console.log('create project');
        console.log(req.decoded.id);
        
        const { name, description } = req.body
        Project.create({
            name : name,
            description: description,
            user_id: req.decoded.id
        })
            .then((data) => {
                res.status(201).json(data)
            })
            .catch(next)

    }

    static addTodo(req, res, next) {
        console.log(req.body);

        Todo.create({
            name: req.body.name,
            description: req.body.desc,
            due_date: req.body.due_date,
            user_id: req.decoded.id,
            isProject: true
        })
            .then(function (newtodo) {
                return Project.updateOne({ _id: req.params.id }, { $push: { todos: newtodo._id } })
            })
            .then((data) => {
                res.status(200).json(data)
            })
            .catch(next)
    }

    static delete(req, res, next) {
        Project.findByIdAndDelete({ _id: req.params.id })
            .then((data) => {
                res.status(200).json(data)
            })
            .catch(next)
    }

    static update(req, res, next) {
        Project.updateOne({ _id: req.params.id },
            {
                name: req.body.name,
                description: req.body.desc
            }
        )
            .then((data) => {
                console.log(data);
                
                res.status(200).json(data)
            })
            .catch(next)
    }


}

module.exports = projectController