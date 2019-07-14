const express = require("express")
const router = express.Router()
const projectController = require("../controllers/project-controller")
const authenticate = require("../middlewares/authenticate")
const authorize = require("../middlewares/authorize")

router.post("/add", authenticate, projectController.createProject)
router.get("/:id", authenticate, authorize, projectController.viewProject)
router.patch("/:id/invite", authenticate, authorize, projectController.inviteMembers)
router.post("/:id/createtodo", authenticate, authorize, projectController.createTodo)
router.patch("/:id/update", authenticate, authorize, projectController.updateTodo)
router.delete("/:id/deleteTodo", authenticate, authorize, projectController.deleteTodo)
router.delete("/:id/delete", authenticate, authorize, projectController.deleteProject)

module.exports = router