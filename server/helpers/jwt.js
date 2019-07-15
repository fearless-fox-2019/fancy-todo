const jwt = require("jsonwebtoken");

function sign(data){
    return jwt.sign(data, process.env.JWT_SECRET, {expiresIn: "1h"});
}

function decode(token){
    return jwt.verify(token, process.env.JWT_SECRET);
}


module.exports = {
    sign,
    decode
}