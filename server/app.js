require('dotenv').config()

const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const baseRoute = require('./routes/index')
const errorHandler = require('./middlewares/errorHandler')
const mongoose = require('mongoose')
const cors = require('cors')

app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use('/', baseRoute)
app.use(errorHandler)

app.listen(port, function() {
    console.log('This app is running on port: ', port)
    mongoose.connect(process.env.URL, { useNewUrlParser: true})
    .then( () => {
        console.log('Connected to db: ', process.env.URL)
    })
})