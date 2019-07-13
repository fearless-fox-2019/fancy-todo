const mongoose = require('mongoose')
const Schema = mongoose.Schema

let taskSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    status: {
        type: String,
        required: true,
        default: false
    },
    duedate: {
        type: Date,
        required: true,
        min: new Date(Date.now() - 864e5)
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    listId: {
        type: Schema.Types.ObjectId,
        ref: 'List'
    }
}, {
    timestamps: true
})

let Task = mongoose.model('Task', taskSchema)

module.exports = Task