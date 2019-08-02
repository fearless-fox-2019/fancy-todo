const express = require("express")
const router = express.Router()
const todoController = require("../controllers/todo-controller")
const authenticate = require('../middlewares/authenticate')
const authorizations = require('../middlewares/authorizations')
router.use(authenticate)
router.get("/category", todoController.findCategory)
router.get("/category/filter?", todoController.findByCategory)
router.post("/", todoController.create)
router.get("/",todoController.get)
router.get("/:id",authorizations,todoController.getOne)
router.put("/:id",authorizations,todoController.update)
router.delete("/:id",authorizations,todoController.destroy)


module.exports = router