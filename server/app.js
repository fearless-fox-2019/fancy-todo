if (process.env.NODE_ENV == 'development') {
    require('dotenv').config()
}

const express = require('express')
const port = 3000
const app = express()
const cors = require('cors')
const morgan = require('morgan')
const routes = require('./routes')
const mongoose = require('mongoose')

const url = 'mongodb://localhost:27017/fancy-todo'
mongoose.connect(url, {useNewUrlParser: true}, function(err) {
    if (err) {
        console.log(err)
    }else {
        console.log('mongoose connected.')
    }
})
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cors())
app.use(morgan('dev'))
app.use('/fancy-todo', routes)



app.listen(port, function(){
    console.log('listening on port: ', port)
})