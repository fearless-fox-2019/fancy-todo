const router = require('express').Router()
const ControllerTodo = require('../controllers/todos')
const authentication = require('../middlewares/authentication')
const forUser = require('./todoPath/todoUser')
const forProject = require('./todoPath/todoProject')

router.use(authentication)

// for user: api/todos/user
router.use('/user', forUser)

// for project : api/todos/project
router.use('/project', forProject)

module.exports = router