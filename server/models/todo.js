const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const todoSchema = new Schema({
    name:{
        type: String,
        required: [true, 'Please input the todo title . .']
    },
    description:{
        type: String,
        required: [true, 'Please explain your todo in here . .']
    },
    status:{
        type: String,
        default: 'New'
    },
    due_date:{
        type: Date,
        required: [true, 'Please check your due date . .']
    },
    UserId:{type: Schema.Types.ObjectId, ref: 'User' }
}, {timestamps: true});


todoSchema.pre('save', function(next) {
    const dateNow = new Date()
    if(dateNow < this.due_date){
        next()
    }else{
        throw({
            msg: 'Please set due_date minimal in th enext day . .'
        })
    }
})

const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo