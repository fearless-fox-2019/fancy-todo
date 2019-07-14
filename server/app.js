if (process.env.NODE_ENV == 'development') {
    require('dotenv').config()
}

const express = require('express');
const app = express();
const port = 3000;
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/fancy-todo', {
    useNewUrlParser: true
});

const cors = require('cors')
const auth = require('./middlewares/auth')

app.use(cors())

app.use(express.json())
app.use(express.urlencoded({
    extended: false
}))

const userRoute = require('./routes/user-router')
const todoRoute = require('./routes/todo-route')

app.use('/users', userRoute)

app.use(auth.authentication)

app.use('/todos', todoRoute)

app.use((err, req, res, next) => {
    if (Object.keys(err).length > 0) {
        res.status(err.status || 500).send(err)
    } else {
        console.log(err.message)
        res.status(err.status || 500).send(err.message)
    }
    console.log({
        message: 'Internal server error',
        error: err
    }, 'from appjs <<<<<<<<<<<<<<<<')

})

app.listen(port, () => console.log(`Example app listening on port ${port}`))