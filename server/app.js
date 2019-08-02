if(!process.env.NODE_ENV || process.env.NODE_ENV === 'development'){
    require('dotenv').config()
}

const express = require('express')
const app = express()
const cors = require('cors')
const port = process.env.PORT || 3000
const route = require('./routes')
const mongoose = require('mongoose');
const errorHandler = require('./middlewares/errorHandler')

//MONGOOSE
mongoose.connect('mongodb://localhost/fancyTodo-db', {useNewUrlParser: true}, function(err){
    if (err) throw err
    else console.log('success connect to database')
});

//URL ENCODED
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(express.json()) // for parsing application/json

//Cors
app.use(cors())

//Initialize routes
app.use('/', route)
app.use(errorHandler)

app.listen(port, () => {
    console.log(`app listening on port ${port}!`)
})