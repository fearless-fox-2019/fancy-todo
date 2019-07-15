const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const todoSchema = new Schema({
    title: {
        type: String
    },
    description: {
        type: String
    },
    due_date: {
        type: Date,

    },
    status: {
        type:Boolean,
        default: false
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

const Todo = mongoose.model('Todo', todoSchema)

module.exports = Todo;