const router = require('express').Router()
const weather = require('../controllers/weatherapi')

router.get('/', weather.searchWeather)

module.exports = router