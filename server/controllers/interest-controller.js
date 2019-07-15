const axios = require('axios');
var instance = axios.create({
});
class ControllerInterest {
    static getInterest(req, res, next) {
        console.log('test')
        instance.get(`https://tastedive.com/api/similar?q=${req.query.favorite}%2C+${req.query.movie}`)
            .then(({ data }) => {
                // console.log(response)
                res.status(200).json(data)
            })
            .catch(next)
    }
}
module.exports = ControllerInterest;