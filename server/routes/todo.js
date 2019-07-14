const express = require("express")
const router = express.Router()
const todoController = require("../controllers/todoController")
const {authenticate} = require("../middlewares/auth")

router.get('/', authenticate, todoController.findAll)
router.post('/create', authenticate, todoController.create)
router.get('/:id', todoController.searchById)
router.put('/:id', todoController.update)
router.delete('/:id', todoController.delete)


module.exports = router