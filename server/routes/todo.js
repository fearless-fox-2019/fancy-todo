const router = require('express').Router()
const Todo = require('../controllers/todo')
const { authorizationTodo } = require('../middlewares/authorization')

router.get('/test', (req, res) => {
    res.status(200).json({
        message: 'Todo route'
    })
})

router.get('/:projectId/:userId', Todo.fetchTodo)
router.get('/:todoId', Todo.findOne)
router.get('/search', Todo.searchTodo)
router.post('/:projectId', Todo.addTodo)
router.patch('/:todoId', authorizationTodo, Todo.editTodo)
router.delete('/:todoId', authorizationTodo, Todo.deleteTodo)

router.post('/test', (req, res) => {
    console.log(req.body)
    res.status(200).json({
        message: 'Here I am',
        info: req.body
    })
})

module.exports = router