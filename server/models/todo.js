const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const todoSchema = new Schema({
    title: {
        type: String
        // required: true
    },
    description: {
        type: String
        // required: true
    },
    status: {
        type: Boolean,
        default: false
    },
    due_date: {
        type: Date,
        required: true
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

module.exports = mongoose.model('Todo', todoSchema)