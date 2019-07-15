const mongoose = require("mongoose");
const {Schema} = mongoose;


const todoSchema = new Schema({
    title: String,
    timePlan: Date,
    status: String,
    decription: String,
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }
});

const Todo = mongoose.model("todo", todoSchema);


module.exports = Todo;


