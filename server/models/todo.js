const mongoose = require('mongoose')

const todoSchema = new mongoose.Schema({
        name: {
            type: String,
            required: [true, 'Must input name']
        },
        description: {
            type: String
        },
        status: {
            type: Boolean,
            default: false
        },
        due_date: {
            type: Date
        }
    })

module.exports = mongoose.model('Todo', todoSchema)