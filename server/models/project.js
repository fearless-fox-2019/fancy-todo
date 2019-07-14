const mongoose = require('mongoose')

const projectSchema = new mongoose.Schema({
    name : String,
    fix_members : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        default : []
    }],
    todos : [{
        default : [],
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Todo',
    }],
    pending_members : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        default : []
    }]
}, { timestamps : true })

const Project = mongoose.model('Project', projectSchema)

module.exports = Project