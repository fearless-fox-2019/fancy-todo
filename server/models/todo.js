const mongoose = require('mongoose')

const todoSchema = mongoose.Schema({
    userId : {type : mongoose.Schema.Types.ObjectId, ref : 'User'},
    name : String,
    description : String,
    status : {
        type : String,
        default : 'uncompleted'
    },
    dueDate : {
        type : Date,
        min : [new Date(), 'minimum due date is tomorrow']
    },
    isProject : {
        type : Boolean,
        default : false
    }
}, { timestamps : true})

const Todo = mongoose.model('Todo', todoSchema)

module.exports = Todo