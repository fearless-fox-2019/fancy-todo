const mongoose = require('mongoose')
const Schema = mongoose.Schema


const todoSchema = new Schema({
    title:{
        type:String,
        required:[true,'Title is required, please fill in this']
    },
    description:{
        type:String,
        required:[true,'Description is required, please fill in this']
    },
    category:{
        type:String,
        require : [true, 'Category is required, please fill in this']
    },
    createdAt:{ type: Date, default: Date.now, timestamps: true},
    dueDate:{
        type:Date,
        required:[true,'the field is required'],
        validate : {
            validator() {
                if (this.dueDate < this.createdAt) {
                    return false
                }
            },
            message: `Invalid dueDate, you cannot set dueDate to past time`
        },
        timestamps: true
    },
    statusFinished:{
        type:Boolean,
        default:false
    },
    userId:{
        type:Schema.Types.ObjectId, ref:'User'
    },
    projectId : {
        type : Schema.Types.ObjectId, ref : 'Project'
    }
})
const todo = mongoose.model('todo',todoSchema)


module.exports = todo