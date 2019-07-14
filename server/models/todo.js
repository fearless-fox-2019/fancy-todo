const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const todoSchema = new Schema({
    title: {
        type: String,
        required: [true, "Title cannot be empty"]
    },
    description: String,
    status: String,
    duedate: Date,
    userId: {
        type: Schema.Types.ObjectId,
        ref : "Users"
    }
}, {timestamps : true});

const Todos = mongoose.model('Todos', todoSchema);
module.exports = Todos