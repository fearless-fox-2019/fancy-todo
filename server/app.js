if (process.env.NODE_ENV === 'development') {
  require('dotenv').config();
}

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express()
const port = process.env.PORT || 3000
const mongoose = require('mongoose');

// Encode From Url or Body EJS
app.use(express.json())
app.use(express.urlencoded({ extended: false }));
mongoose.connect(process.env.DB_MONGOOSE, {useNewUrlParser: true, useCreateIndex: true}, function(err) {
  if (err) console.log('Mongoose Error');
});

app.use(cors())
app.use(morgan('tiny'))

// Routes Main
const routesIndex = require('./routes/routes.js');

//  Home Page
app.use('/', routesIndex)
app.use((err, req, res, next) => {
  const message = err.message || `Internal Server Error`
  const status =  err.status || 500
  console.log(`Middleware Error || \n`, err);
  res.status(status).json({message})
})

app.listen(port, () => console.log(`Hello from port : ${port}! 😙`))