const {Todo} = require('../models/index')
const {MongoClient, ObjectID} = require('mongodb');

class TodoController{
    static create(req, res, next){
        const {name, description, due_date} = req.body
        const UserId = req.decoded.id
        const newData = {name, description, due_date, UserId}
        Todo.create(newData)
        .then(response => {
            res.status(201).json({
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
                message: 'success get all data !',
                data: response
            })
        })
        .catch(next)

    }
    static findAllById(req, res, next){
        Todo.find({
            UserId: req.decoded.id
        })
        .then(response => {
            res.status(200).json({
                message: 'success get all data by id!',
                data: response
            })
        })
        .catch(next)

    }
    static findById(req, res, next){
        //id nya ObjectID
        const id = req.params.id
        Todo.findById({
            _id: id
        })
        .then(response => {
            res.status(200).json({
                message: 'success get data by ID!',
                data: response
            })
        })
        .catch(next)
    }
    // search title
    static findOne(req, res, next){
        console.log(req.decoded, 'dec')
        const find = req.params.title
        Todo.find({
            name: { "$regex": find, "$options": "i" },
            UserId: req.decoded.id
        })
        .then(response => {
            res.status(200).json({
                message: 'success get data by title !',
                data: response
            })
        })
        .catch(next)
    }
    static edit(req, res, next){
        const upData = req.body
        Todo.findByIdAndUpdate(req.params.id, upData, {new: true})
        .then(response => {
            res.status(200).json(response)
        })
        .catch(() => next(
            {status: 400,
            message: 'salah update'}
        ))
    }
    static delete(req, res, next){
        const id = req.params.id
        Todo.findByIdAndDelete(id)
        .then(response => {
            res.status(200).json({
                id
            })
        })
        .catch(next)
    }
    static sortBystatus(req, res, next){
        const find = req.params.status
        Todo.find({
            status: { "$regex": find, "$options": "i" },
            UserId: req.decoded.id
        })
        .then(response => {
            res.status(200).json({
                message: 'success get data by status!',
                data: response
            })
        })
        .catch(next)
    }
}

module.exports = TodoController