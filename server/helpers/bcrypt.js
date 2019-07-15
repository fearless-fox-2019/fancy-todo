const bcrypt = require("bcryptjs");


function hash(password){
    return bcrypt.genSalt(10)
        .then((salt) => {
            return bcrypt.hash(password, salt);
        })
        .catch((err) => {
            throw err;
        })
}

function compare(inputtedPassword, hashedPassword){
    return bcrypt.compare(inputtedPassword, hashedPassword);
}


module.exports = {
    hash,
    compare
}