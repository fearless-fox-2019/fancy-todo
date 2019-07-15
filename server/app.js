if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    require('dotenv').config();
}

const express = require('express')
const route = require('./routes')
const mongoose = require('mongoose')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.urlencoded({
    extended: false
}))
app.use(express.json())

mongoose.connect('mongodb://localhost/fencyTodo', {
    useNewUrlParser: true
}, (err) => {
    if (err) console.log('mongoose connection failed');
    else console.log('mongoose connection success');
});

app.use('/', route)

app.use(function (err, req, res, next) {
    console.log('error handling');
    console.log('err: ', err);
})

app.listen(port, () => {
    console.log(`listening on port ${port}`)
})