const router = require('express').Router()
const userRouter = require('./userRouter')
const todoRouter = require('./todoRouter')
const apiWeather = require('./api')

router.use('/users',userRouter)
router.use('/todos',todoRouter)
router.use('/weathers',apiWeather)

module.exports = router