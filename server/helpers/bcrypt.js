const bcrypt = require('bcryptjs')

module.exports = {
    hash: function(password){
        return bcrypt.hashSync(password,10)
    },
    compare : function(password,hash) {
        return bcrypt.compareSync(password,hash)
    }
}
