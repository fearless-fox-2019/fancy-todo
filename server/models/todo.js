const mongoose = require("mongoose")

const todoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "name is empty"],
        unique: true
    },
    description: {
        type: String,
        required: [true, "description is empty"]
    },
    status: {
        type: Boolean,
        default:false

    },
    category: {
        type: String,
        required: [true, "category is empty"],
    },
    dueDate: {
        type: Date,
        required:[true,'due date is empty']
    },
    user: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, {timestamps: true})


module.exports = mongoose.model("Todo", todoSchema)