require('dotenv').config()
if(process.env.NODE_ENV === 'development') {
  console.log('on development')
}
const express = require('express');
const app = express();
const routes = require('./routes');
const port = process.env.PORT ||  3000;
const cors = require('cors');

app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use(cors());
app.use('/api', routes)

const mongoose = require('mongoose');
const url =  process.env.MONGODB_ATLAS_URL || 'mongodb://localhost:27017/fancy-todo'
mongoose.connect(url, {useNewUrlParser: true}, (err) => {
  if(err) {
    console.log(err)
  }
  else {
    console.log('mongoose connected')
  }
})

app.use(function(err,req,res,next){
  console.log(err)
  if(err.code === 404) {
    res.status(404).json({ message: 'Resource not found' })
  } else {
    const status = err.status || 500
    const message = err.message || 'Internal server error'
    res.status(status).json({ message: message })
  }
});

app.listen(port, () => console.log(`listening on port`, port))

//install axios, bcrypt, cors, dotenv, express, jwt, mongoose