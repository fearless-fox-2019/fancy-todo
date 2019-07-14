const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TodoSchema = new Schema({
    name : {
        type : String,
        required : [true, `Please add title name`]
    },
    description : {
        type : String,
        required : [true, `Please fill the blank`]
    },
    status : {
        type : Boolean, 
        default : false
    },
    due_date : {
        type : Date,
        required : [true, `Please fill the blank`],
        min: [new Date().toISOString().substring(0, 10), "the date has passed"]
    },
    UserId : { type: Schema.Types.ObjectId, ref: 'User' }
}, {timestamps:true})

const Todo = mongoose.model('Todo', TodoSchema)

module.exports = Todo

