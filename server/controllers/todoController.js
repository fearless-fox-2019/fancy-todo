const { userModel, todoModel } = require('../models')
const { compare } = require('../helpers/bcrypt')
const { decodeId, verify } = require('../helpers/jwtoken')
const moment = require('moment')

class TodoController {

  static create(req, res, next) {
    console.log(req.body);
    let { title, description, dueDate } = req.body
    let decode = verify(req.headers.token)
    let dataToCreate = {
      userId: decode._id,
      title,
      description,
      dueDate,
      status : false,
      moment: moment(dueDate).endOf('day').fromNow()
    }
    todoModel.create(dataToCreate)
      .then(data => {
        res.status(201).json({
          newData: data
        })
      })
      .catch(next)
  }

  static read(req, res, next) {
    let decode = verify(req.headers.token)
    todoModel.find({ userId: decode._id })
      .then(data => {
        res.status(200).json({
          data
        })
      })
      .catch(next)
  }

  static update(req, res, next) {
    todoModel.updateOne({ _id: req.params.id }, req.body)
      .then(dataUpdated => {
        if (dataUpdated.nModified != 0) {
          res.status(200).json({
            msg: `Data successfully updated`
          })
        }
        else {
          throw {
            status: 404
          }
        }
      })
      .catch(next)
  }

  static destroy(req, res, next) {
    todoModel.deleteOne({_id : req.params.id})
    .then((del)=>{
      if(del.deletedCount != 0) {
        res.status(200).json({
          msg : `${del.deletedCount} transaction(s) successfully deleted`
        })
      }
      else{
        throw {
          status : 404
        }
      }
    })
    .catch(next)
  }

}

module.exports = TodoController