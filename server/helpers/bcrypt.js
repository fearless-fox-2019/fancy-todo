const bcrypt = require('bcryptjs')
const salt = bcrypt.genSaltSync(10)

module.exports = {
    hash: function (plainPassword) {
        return bcrypt.hashSync(plainPassword, salt)
    },
    compare: function (plainPassword, hashedPassword) {
        return bcrypt.compareSync(plainPassword, hashedPassword)
    }
}