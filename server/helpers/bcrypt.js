const bcrypt = require('bcrypt')

function hashPassword(value) {
    console.log(value, 'di bcrypt')
    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(value, salt)
    return hash
}

function comparePassword(dataset, reqbody) {
    return bcrypt.compareSync(reqbody, dataset)
}

module.exports = {hashPassword, comparePassword}