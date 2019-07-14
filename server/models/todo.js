const mongoose = require("mongoose")
const Schema = mongoose.Schema

const todoSchema = new Schema({
    name: {
        type: String,
        required: [true, "Todo name cannot be empty"]
    },
    category: {
        type: String,
        required: [true, "Category cannot be empty"]
    },
    status: {
        type: Boolean
    },
    project: {type: Schema.Types.ObjectId, ref:"Project"}

},{timestamps: true})

module.exports = mongoose.model("Todo", todoSchema)