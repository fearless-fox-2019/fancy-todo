const jwt = require('jsonwebtoken')
module.exports = (req,res,next) =>{
  if(req.headers.token){
    try {
      req.decoded = jwt.verify(req.headers.token, process.env.JWT_SECRET)
      next()
    } catch (error) {
      throw {
        status : 400,
        message :'Invalid Token'
      }
    }
  }else{
    throw {
      status : 400,
      message : 'please login first'
    }
  }
}