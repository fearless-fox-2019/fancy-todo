if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
    require('dotenv').config()
}

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const router = require('./routes')
const errHandler = require('./middleware/errHandler')
const port = process.env.PORT

const app = express()

mongoose.connect('mongodb://localhost:27017/' + process.env.DB_NAME, {
    useNewUrlParser: true
}, (err) => {
    if (err) console.log(err), console.log(`Can't connect to mongoose server.`);
    else console.log(`Mongoose connect success`)
})
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({
    extended: false
}))

app.use('/', router)
app.use('/', errHandler)

app.listen(port, () => {
    console.log(`Connected to port: ${port} !!!`)
})
