const Helper = require('../helpers/helper')

module.exports = {
    authentication : (req, res, next) => {
        try {
            console.log(req.headers.access_token, 'This token inside the middleware')
            const decoded = Helper.verifyJWT(req.headers.access_token);
            req.loggedUser = decoded
            console.log(req.loggedUser)
            next()
        } catch (err) {
            res.status(500).json(err)
        }
    }
}