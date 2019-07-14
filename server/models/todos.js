const mongoose = require('mongoose')
const Schema = mongoose.Schema

const todoSchema = new Schema({
    name: {
        type: String,
        required: [true, 'name is required']
    },
    description: {
        type: String,
        required: [true, 'description is required']
    },
    status: {
        type: Boolean,
        default:false,
    },
    dueDate: {
        type: Date,
        validate: {
            validator: function(value) {
                let now = new Date() 
                now = now.setHours(0, 0, 0, 0)
                console.log(now)
                console.log(value)
                if (now <= value) {
                    return true
                } else {
                    return false 
                }
            },
            message: `must be greater than today`
        },
        required: [true, 'dueDate is required']
    },
    completed_date: {
        type: Date
    },
    is_starred: {
        type: Boolean,
        default:false,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
},)


module.exports = todoSchema