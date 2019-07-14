const router = require('express').Router()
const todo = require('../controllers/todo')

router.post('/', todo.create)
router.get('/', todo.findAll)
router.get('/:id', todo.findOne)

module.exports = router