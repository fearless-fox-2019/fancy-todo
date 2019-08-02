const axios = require('axios');

class WeatherController {
    static getWeather (req, res, next){
        // res.send('Masuk Controller Weather')
        let {location} = req.query
        axios({
            method: "get",
            url: `https://community-open-weather-map.p.rapidapi.com/weather?q=${location}`,
            headers: {
                "X-RapidAPI-Key" :"783caae55fmsh847910fcf055d06p1dc77ejsne42e1cd53737",
                "X-RapidAPI-Host":"community-open-weather-map.p.rapidapi.com"
            }
        }).then(({data})=>{
            // console.log('masuk wheather', data)
            res.status(200).json(data)
        }).catch(next)
    }
}

module.exports = WeatherController