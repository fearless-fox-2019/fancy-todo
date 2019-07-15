const { Schema, model } = require('mongoose')

const todoSchema = new Schema({
    projectId: {
        type: Schema.Types.ObjectId,
        ref: 'Project'
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    name: {
        type: String,
        required: [true, 'Name field cannot be empty']
    },
    description: {
        type: String,
        required: [true, 'Description field cannot be empty']
    },
    status: {
        type: Boolean,
        default: false
    },
    due_date: {
        type: Date,
        required: [true, 'Due date cannot be empty']
    }
}, {timestamps: true, versionKey: false})

const Todo = model('Todo', todoSchema)
module.exports = Todo