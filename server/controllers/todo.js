const {Todo} = require('../models/index')
const {MongoClient, ObjectID} = require('mongodb');

class TodoController{
    static create(req, res, next){
        const {name, description, status, due_date, UserId} = req.body
        const newData = {name, description, status, due_date, UserId}
        Todo.create(newData)
        .then(response => {
            res.status(200).json({
                message: 'success create !!', 
                data: response
            })
        })
        .catch(next)
    }
    static findAll(req, res, next){
        Todo.find()
        .then(response => {
            res.status(200).json({
                message: 'success get data !',
                data: response
            })
        })
        .catch(next)

    }
    static findOne(req, res, next){
        Todo.find()
        .then(response => {
            res.status(200).json({
                message: 'success get data !',
                data: response
            })
        })
        .catch(next)
    }
    static edit(req, res, next){

    }
}

module.exports = TodoController