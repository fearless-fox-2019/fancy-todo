const mongoose = require('mongoose')
const Schema =  mongoose.Schema

let listSchema = new Schema ({
    name: {
        type: String,
        require: true
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    projectId: {
        type: Schema.Types.ObjectId,
        ref: 'Project',
        default: null
    },
    taskId: [{
        type: Schema.Types.ObjectId,
        ref: 'Task',
        default: []
    }]
},{
  timestamps: true  
})

let List = mongoose.model('List',listSchema)

module.exports = List