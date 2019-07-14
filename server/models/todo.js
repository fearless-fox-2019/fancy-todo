const mongoose = require('mongoose');
var Schema = mongoose.Schema;
const User = require('./user')

/* Generate Model */
let TodoSchema = new Schema({
    name : String,
    description : String,
    status : String,
    due_date : Date,
    time : String,
    UserId : {type : Schema.Types.ObjectId, ref : 'User'}
})

/* middlewares/hooks */
TodoSchema.pre('save', function(next){
    User.findOne({ _id : this.UserId })
    .then(data => {
        if(!data){
            next({status : 500, message : 'this User id not found!'})
        }
        else{
            next()
        }
    })
})

TodoSchema.pre('save', function(next) {
    const diffTime =  this.due_date.getTime() - new Date().getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    console.log(diffDays)
    if(diffDays < 0){
        next({status : 500, message: 'Due Date can\'t be before today'})
    }
    else {
        next()
    }
})

const Todo = mongoose.model('Todo', TodoSchema)

module.exports = Todo