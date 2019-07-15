const { Schema, model } = require('mongoose')

const todoSchema = new Schema({
  name: String,
  description: String,
  status: {type: Boolean, default: false},
  due_date: Date,
  project: {type: Schema.Types.ObjectId, ref: 'Project', default: null},
  user: {type: Schema.Types.ObjectId, ref: 'User', default: null},
  category: String
})


const Todo = model('Todo', todoSchema)

module.exports = Todo