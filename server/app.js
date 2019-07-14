if(!process.env.NODE_ENV || process.env.NODE_ENV === 'development') require('dotenv').config()
const express = require('express')
const app = express()
const moongose = require('mongoose')
const cors = require('cors')
const port = process.env.PORT || 4000
const errHandler = require('./middlewares/error-handlers')
const routes = require('./routes/index')

// db moongose
moongose.connect(process.env.MONGODB_URL, {useNewUrlParser:true})
.then(response => {
    console.log('Connected to fancy-todo')
})
.catch(err => {
    console.log(err.message)
})
app.use(express.urlencoded({extended:false}))
app.use(express.json())
app.use(cors())

app.use('/', routes)

//error handler
app.use(errHandler)

// app.use("/", (req, res)=>{
//     res.status(200).json({
//         msg: 'Tersambung dengan server todos !'
//     })
// })

app.listen(port, () => console.log( `port ${port} is running!`))