const mongoose = require('mongoose')
const Schema = mongoose.Schema

const projectSchema= new Schema({
    name:{
        type: String,
        required: [true, 'Name must be filled']
    },
    description: String,
    creator:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    members:[{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    todoList:[{
        type: Schema.Types.ObjectId,
        ref: 'Todo'
    }]
},{ timestamps: true})

const Project= mongoose.model('Project', projectSchema)

module.exports= Project