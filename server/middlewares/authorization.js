const {verify} = require('../helpers/jwt')
const todo = require('../models/todo')

module.exports = (req, res, next) => {
    console.log('masuk ke authorization')
    let credential = verify(req.headers["token"])
    console.log(credential, 'ini credentialsss???????????')
    todo.find({ userId: credential.id })
    .then((found) => {
        console.log(found, 'ini foundd???????????????????????')
        // if (String(found.userId) == credential.id) {
            console.log('authorization sukses')
            next()
        // }
        // else {
    })
    .catch(err =>{
        console.log('gagal authorization')
        res.status(401).json('Unauthorized, You do not have access to do this')
        // }
    })
}