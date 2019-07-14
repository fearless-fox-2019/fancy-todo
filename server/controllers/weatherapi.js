const axios = require('axios')

class ApiWeather {

  static searchWeather(req, res, next) {
    axios.get("https://api.darksky.net/forecast/1833e31417c81a6aa67791f48876e1f0/6.2088,106.8456")
      .then(({ data }) => {
        res.status(200).json(data)
      })
      .catch(next)
  }

}

module.exports = ApiWeather