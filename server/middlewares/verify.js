if (process.env.NODE_ENV === 'development') {
  require('dotenv').config();
}
const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  try {
    req.decoded = jwt.verify(req.headers.token, process.env.JWT_SECRET);
    console.log('msk mid');
    next()
  } catch(err) {
    // throw err
    throw {
      message : 'Invalid Token',
      status : 401
    }
  }
}

module.exports = verifyToken
