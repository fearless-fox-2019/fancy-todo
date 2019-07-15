const {verify} = require('../helpers/jwt')
const todo = require('../models/todo')

module.exports = (req, res, next) => {
    let credential = verify(req.headers["access-token"])
    todo.findOne({ _id: req.params.id })
    .then((found) => {
        if (String(found.userId) == credential.id) {
            next()
        }
        else {
            res.status(401).json('You do not have access to do this')
        }
    })
}