const mongoose = require('mongoose');
const moment = require('moment');
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
    default : null,
    validate : {
      validator : function (value) {
        if (value !== null) {
          let date = moment(value.toISOString().split('T')[0].split('-').join(''), "YYYYMMDD").fromNow(); // 8 years ago
          return (date.includes('ago') === true ) ? false : true
        }
      },
      message : 'Please Provide a Valid Date'
    }
  },
}, { 
  versionKey : false,
  timestamps : {}
});


let Todo = mongoose.model('todo', todoSchema)

module.exports = Todo
