const Todo = require('../models/todo')
const send = require('../helpers/mail')
const dateConverter = require('../helpers/dateConverter')
class TodoController {

    static findUncomplete(req, res, next){
        // console.log(req.decoded)
        Todo.find({ status : 'uncompleted', UserId : req.decoded.id })
        .then(data => {
            if(!data){
                next({ status : 404, message : 'data not found!' })
            }
            else{
                let newData = []
                data.forEach(el => {
                    let correctDate = dateConverter(el.due_date)
                    let objData = {
                        _id : el._id,
                        name : el.name,
                        description : el.description,
                        status : el.status,
                        due_date : correctDate,
                        time : el.time,
                        UserId : el.UserId
                    }            
                    newData.push(objData)
                })
                res.status(200).json(newData)
            }
        })
        .catch(next)
    }

    static findComplete(req, res, next){
        console.log('masuk controller')
        // console.log(req.decoded)
        Todo.find({ status : 'completed', UserId : req.decoded.id })
        .then(data => {
            if(!data){
                next({ status : 404, message : 'data not found!' })
            }
            else{
                let newData = []
                data.forEach(el => {
                    let correctDate = dateConverter(el.due_date)
                    let objData = {
                        _id : el._id,
                        name : el.name,
                        description : el.description,
                        status : el.status,
                        due_date : correctDate,
                        time : el.time,
                        UserId : el.UserId
                    }            
                    newData.push(objData)
                })
                res.status(200).json(newData)
            }
        })
        .catch(next)
    }

    static create(req, res, next){
        // console.log(req.body)
        const newTodo = {
            name : req.body.name,
            description : req.body.description,
            status : 'uncompleted',
            due_date : req.body.due_date,
            time : req.body.time,
            UserId : req.decoded.id
        }
        // console.log(newTodo)
        Todo.create(newTodo)
        .then(data => {
            res.status(201).json(data)
        })
        .catch(err =>{
            if(err.message.includes('UserId')){
                next({status : 500, message : 'this User id not found!'})
            }
            else{
                next(err)
            }
        })
    }

    static delete(req, res, next){
        Todo.deleteOne({ _id : req.params.id})
        .then(result => {
            res.status(200).json(result)
        })
        .catch(next)
    }
    
    static updateTodoStatus(req, res, next){
        Todo.updateOne({ _id : req.params.id }, {status : 'completed'})
        .then(result => {
            res.status(200).json(result)
        })
        .catch(next)
    }

    static sendEmail(req, res, next){
        Todo.find({ UserId : req.decoded.id, status : 'uncompleted' })
        .then(data => {
            let message = ''
            data.forEach(el => {
                message += `<p>Name : ${el.name}</p> <p>Description : ${el.description}</p> <p>Due Date : ${dateConverter(el.due_date)}</p><br>`
            })
            send(req.decoded.email, message, req.headers.name)
        })
        .catch(next)
    }

    static searchName(req, res, next){
        let regex = new RegExp(req.body.name, 'i')
        Todo.find({name : {$regex : regex}})
        .then(data => {
            if(data.length > 0){
                res.status(200).json(data)
            }
            else{
                next({status : 404, message : 'data not found'})
            }
        })
        .catch(next)
    }
}

module.exports = TodoController