const bcrypt = require('bcryptjs')
module.exports = (passwordInput,hashedPassword) => {
    return bcrypt.compareSync(passwordInput, hashedPassword)
}