const todoListModel = require('../models/todoListModel')

class todoListController {
    static getOne(req, res, next) {}
    static getAll(req, res, next) {}

    static create(req, res, next) {
        console.log(req.body,'<== ini isi req,body?')
        console.log(req.body.name, ',++ ini kan name/')
        console.log(req.body.todoId, ',++ ini kan todoId/')
        console.log(req.body.projectId, ',++ ini kan projectId/')
        let { name, todoId, projectId } = req.body
        // let newList = { name, todoId, projectId }
        // console.log(newList, 'newList')
        // console.log(req.decode,'<== ini decode')
        // console.log(req.logedUser,'<== ini user')
        // res.status(201).json('success')

        let newList = new todoListModel({
            name, todoId
        })

        newList.save()
            .then(success => {
                res.status(201).json(success)
            }).catch(next)

        // todoListModel
        //     .create(newList)
        //     .then((created)=> {
        //         // console.log(created,'<== berhasil di created todo listnya')
        //         res.status(201).json(created)
        //     })
        //     .catch(next)
    }
    static update(req, res, next) {}
    static delete(req, res, next) {}
}

module.exports = todoListController