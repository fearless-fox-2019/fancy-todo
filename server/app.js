if(process.env.NODE_ENV === 'development'){
    require('dotenv').config()
}
const express = require('express')
const app = express()
const port = 3000
const mongoose = require('mongoose')
const cors = require('cors')
const router = require('./routes')
const errorHandler = require('./helpers/errorHandler')

mongoose.connect(process.env.MONGODB_URL, {useNewUrlParser: true})
.then(resp => {
    console.log("We're Connected")
})
.catch(err => {
    console.log("We failed to connect")
})

app.use(express.urlencoded({ extended:false }))
app.use(express.json())
app.use(cors())

app.use('/', router)
app.use(errorHandler)

app.listen(port,()=>{
    console.log('listening in port '+ port);
    
})