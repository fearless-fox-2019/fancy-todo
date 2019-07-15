const bcrypt = require('bcryptjs')
const salt = bcrypt.genSaltSync(10)

function hash(password) {
    return bcrypt.hashSync(password, salt)
}

function compare(password, hashedPassword) {
    return bcrypt.compareSync(password, hashedPassword)
}

module.exports = {
    hash, compare
}