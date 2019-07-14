const mongoose = require('mongoose')

let Schema = mongoose.Schema
const todoSchema = new Schema({
    name: String,
    description: String,
    status: {
        type: Boolean,
        default: false
    },
    due_date: {
        type: Date,
        validate: {
            validator: function (value) {
                return value > Date.now()
            },
            message: props => `you must set the date at least tomorrow!`
        }
    },
    user_id: {
        type: Schema.Types.ObjectId, ref: 'User'
    },
    isProject : {
        type: Boolean, default: false
    }
},{timestamps : true})


const Todo = mongoose.model('Todo',todoSchema)

module.exports = Todo