const { Schema, model } = require('mongoose')
const projectSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name field cannot be empty']
    },
    admin: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Project must have administrator']
    },
    members: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
}, {timestamps: true, versionKey: false})

const Project = model('Project', projectSchema)
module.exports = Project