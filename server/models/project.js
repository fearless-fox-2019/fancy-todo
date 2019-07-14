const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
    name: String,
    members: [{
        type: Schema.Types.ObjectId,
        ref : "Users"
    }],
    todos: [{
        type: Schema.Types.ObjectId,
        ref: "Todos"
    }]
}, {timestamps : true});

const Projects = mongoose.model('Projects', ProjectSchema);
module.exports = Projects