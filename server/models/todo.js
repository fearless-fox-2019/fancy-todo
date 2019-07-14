const mongoose = require('mongoose')
const Schema = mongoose.Schema

const todoSchema = new Schema({
    name:{
        type: String,
        required: [true, 'Name must be filled']
    },
    description: {
        type: String,
        required: [true, 'Description must be filled']
    },
    status:{
        type: String,
        default: 'todo'
    },
    dueDate:{
        type: Date,
        required: [true, 'Due Date must be filled']
    },
    userId:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required:[true, 'User Id must defined']
    },
    projectId:{
        type: Schema.Types.ObjectId,
        ref: 'Project',
        required:[true, 'Project Id must defined']
    }
},{ timestamps: true})

let Todo = mongoose.model('Todo', todoSchema)

module.exports= Todo