const mongoose = require('mongoose')

let Schema = mongoose.Schema
const projectSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: String,
    user_id: {type: Schema.Types.ObjectId, ref: 'User'},
    members : [{type: Schema.Types.ObjectId, ref: 'User'}],
    todos: [{type: Schema.Types.ObjectId, ref: 'Todo'}]
},{timestamps : true})

const Project = mongoose.model('Project',projectSchema)

module.exports = Project