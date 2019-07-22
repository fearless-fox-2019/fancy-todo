const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const todoSchema = new Schema({
    title: String,
    description: String,
    status: Boolean,
    duedate: String,
    userId: {
        type: Schema.Types.ObjectId,
        ref : "Users"
    },
    projectId: {
        type: Schema.Types.ObjectId,
        ref : "Project"
    }
}, {timestamps : true});

const Todos = mongoose.model('Todos', todoSchema);
module.exports = Todos