const jwt = require('jsonwebtoken');

module.exports = (user) => {
    return jwt.sign({
        id : user.id,
        username : user.username,
        email : user.email
    }, process.env.SECRET_JWT, { expiresIn: '8h'});
}