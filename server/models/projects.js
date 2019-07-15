const {Schema, model} = require('mongoose')
const User = require('./users')

const projectSchema = new Schema({
  name : String,
  owner : {type: Schema.Types.ObjectId, ref: 'User'},
  members : [{type: Schema.Types.ObjectId, ref: 'User'}]
})


projectSchema.pre('remove', function(next) {
  let members = this.members // this.members isn't defined
  let arrPromise = []
  members.forEach(user => {
    arrPromise.push(User.updateOne({_id : user}, { $pull : {projects : {$in : [this._id]}}}))
  });
  Promise.all(arrPromise)
  .then(result => {
    return next()
  })
})

const Project = model('Project', projectSchema)

module.exports = Project
