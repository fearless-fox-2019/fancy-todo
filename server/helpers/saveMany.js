const User = require('../models/users')
const Project = require('../models/projects')

module.exports = (members, projectId) => {
  return new Promise((resolve, reject) => {
    let findArr = []
    members.forEach(user => {
      findArr.push(User.updateOne({_id: user}, {$push: {projects: projectId}}))
    });
    Promise.all(findArr)
    .then(users => {
      resolve(users)
    })
    .catch(err => reject(err))
  })
}