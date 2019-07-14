const jwt = require('../helpers/jwt')
const Model = require('../models/index')

function aunthetication(req, res, next) {
    const token = req.headers.token
    try {
        const decoded = jwt.checkToken(token)
        req.decoded = decoded
        next()
      } catch(err) {
        res.status(403).json({
            message: 'Forbidden - gabisa',
            data: err
        })
      }
}
function authorization(req, res, next) {
    const token = req.headers.token
    try {
        const todoId = req.params.id
        Model.Todo.findOne({where: {id: todoId}})
        .then(data =>{
            const decoded = jwt.checkToken(token)
            if(data.UserId === decoded.data.id){
                next()
            }else{
                res.status(401).json({
                    message: 'Not Authorized',
                    data: data.username
                })
            }
        })
        .catch(err => {
            res.status(404).json({
                message: 'Not Found - 1',
                data: err
            })
        })
    } catch (err) {
        res.status(500).json({
            message: 'Internal Server Error',
            data: err
        })
    }
    
}

module.exports = {aunthetication, authorization}