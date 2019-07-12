const jwt = require('jsonwebtoken')

module.exports = {
    sign: function(payload) {
        return jwt.sign(payload, process.env.JWT_SECRET)
    },
    verify: function (token) {
        try {
            var decoded = jwt.verify(token, process.env.JWT_SECRET);
            return decoded
          } catch(err) {
              throw ({code: 401, message: `Invalid token`, source: `verify token`})
          }
    }
}