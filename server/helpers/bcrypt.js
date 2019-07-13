const bcrypt = require('bcryptjs')
const salt = bcrypt.genSaltSync(10)

module.exports = {
    hash(plainPassword) {
        let hashed = bcrypt.hashSync(plainPassword,salt)
        return hashed
    },
    compare(plainPassword, hashedPassword) {
        let compared = bcrypt.compareSync(plainPassword,hashedPassword)
        return compared
    }
}
