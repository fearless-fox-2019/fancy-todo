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
        default: 'Todo',
        require : [true, 'Category is required, please fill in this']
    },
    createdAt:{ type: Date, default: Date.now, timestamps: true},
    dueDate:{
        type:Date,
        required:[true,'the field is required'],
        validate : {
            validator() {
                if (this.dueDate < this.createdAt) {
                    res.status(400).json('Invalid dueDate, you cannot set dueDate to past time')
                    return false
                }
            },
            message: `Invalid dueDate, you cannot set dueDate to past time`
        },
        timestamps: true
    },
    // statusFinished:{
    //     type:Boolean,
    //     default:false
    // },
    userId:{
        type:Schema.Types.ObjectId, ref:'user'
    },
    projectId : {
        type : Schema.Types.ObjectId, ref : 'project'
    }
})
const todo = mongoose.model('todo',todoSchema)


module.exports = todo