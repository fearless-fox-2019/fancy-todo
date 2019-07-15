if(process.env.NODE_ENV === "development") {
    require('dotenv').config()
}

const express = require('express')
    , mongoose = require('mongoose')
    , cors = require('cors')

const app = express()
    , routes = require('./routes')
    , port = process.env.PORT

const db = mongoose.connection

// Connect to Mongoose Server
mongoose.connect('mongodb://localhost:27017/fancy-todo',
    {
        useNewUrlParser: true,
        useFindAndModify: false,
        useCreateIndex: true
    })
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function() {
    console.log('Connected to mongodb using mongoose')
});

// Middleware
app.use(cors())
app.use(express.urlencoded({ extended: false }));
app.use(express.json())

// Routes
app.use('/api', routes)

// Server Listen on Port
app.listen(port, () => console.log('Listening on port ', port))