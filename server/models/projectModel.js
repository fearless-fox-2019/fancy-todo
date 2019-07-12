const mongoose = require('mongoose')
const Schema = mongoose.Schema

let projectSchema = new Schema ({
    name: {
        type: String,
        required: true,
        minlength: [2, 'Project ame too short']
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    members: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    list: [{
        type: Schema.Types.ObjectId,
        ref: 'List'
    }]
})

let Project = mongoose.model ('Project', projectSchema)

module.exports = Project