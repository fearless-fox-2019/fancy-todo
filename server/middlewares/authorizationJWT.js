const { todoModel } = require('../models/index')
module.exports = (req, res, next) => {

  todoModel.find({_id : req.params.id})
    .then(dataTodo => {
      if (dataTodo) {
        console.log(req.decoded._id)
        console.log(dataTodo[0])
        if (dataTodo[0].userId == req.decoded._id) {
          next()
        }
        else {
          throw {
            status: 401,
            message: 'Unauthorized'
          }
        }
      } else {
        throw {
          status: 404,
          message: 'Data not Found'
        }
      }
    })
    .catch(next)
}