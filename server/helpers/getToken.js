let jwt = require('jsonwebtoken')

module.exports = (payload) => {
  // console.log(payload);
  let token = jwt.sign(payload, process.env.JWT_SECRET)
  return token
}