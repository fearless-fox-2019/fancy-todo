if(!process.env.NODE_ENV || process.env.NODE_ENV === 'development'){
    require('dotenv').config()
}

const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const app = express()
const port = process.env.PORT || 3000
const routes = require('./routes/indexRoutes')
const mongoose = require('mongoose')
app.use(express.urlencoded({extended: false}));
app.use(express.json())
app.use(cors())
app.use(morgan())

mongoose.connect('mongodb://localhost:27017/fancytodo', {useNewUrlParser: true})
.then(() => {
    console.log('Mongoose connected!')
})
.catch(() => {
    console.log('Failed to connect mongoose')
})

app.use('/',routes)


app.use(function (err, req, res, next) {
    console.log(err)
   const status = err.status || 500
   const message = err.message || 'Internal server error'
    res.status(status).json({message : message})
})
app.listen(port, () => console.log('Example app listening on port : ' + port))