const bcrypt = require('bcryptjs')
const salt = bcrypt.genSaltSync(10)

module.exports = {
    encrypt(password){
        return bcrypt.hashSync(password, salt)
    },

    decrypt(password, hash){
        return bcrypt.compareSync(password, hash)
    }
}