const mongoose = require('mongoose')
const Schema = mongoose.Schema

let projectSchema = new Schema({
    name: {
        type: String,
        required: true,
        minlength: [2, 'Project name too short']
    },
    description: {
        type: String,
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    members: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: []
    }],
    list: [{
        type: Schema.Types.ObjectId,
        ref: 'List',
        default: []
    }]
},{
    timestamps: true
})

let Project = mongoose.model('Project', projectSchema)

module.exports = Project