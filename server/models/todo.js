const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const todoSchema = new Schema({
  name:  {
    type : String,
    required : [true, `Please Specify the Your Name`],
    match : [/^[a-zA-Z ]*$/, `Your Name can only contain Alphabet and Space`]
  },
  description : {
    type : String,
  },
  creator: {
    type : Schema.Types.ObjectId,
    ref : 'user',
  },
  isFinished: {
    type : Boolean,
    default : false
  },
  dueDate: {
    type : Date,
    default : null
  },
}, { timestamp : true });

let Todo = mongoose.model('todo', todoSchema)

module.exports = Todo
