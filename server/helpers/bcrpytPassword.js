const bcrypt = require('bcrypt')
const saltRounds = 10;

function hashPassword(password) {
    var salt = bcrypt.genSaltSync(saltRounds);
    var hash = bcrypt.hashSync(password, salt)
    return hash
}

function comparePassword(password,hash) {
    return bcrypt.compareSync(password,hash)
}

module.exports = {
    hashPassword,
    comparePassword
}