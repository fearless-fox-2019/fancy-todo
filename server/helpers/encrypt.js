
const bcryptjs = require('bcryptjs');
let salt = bcryptjs.genSaltSync(8);
function encrypt(password){
    return hash = bcryptjs.hashSync(password, salt)
}

module.exports = encrypt