const router = require('express').Router()
const WeatherController = require('../controllers/weatherController')

router.get('/', WeatherController.getWeather)

module.exports = router