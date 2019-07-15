const express = require('express')
    , router = express.Router()
    , todos = require('./todo')
    , users = require('./user')

router.use('/todos', todos)
router.use('/users', users)

module.exports = router