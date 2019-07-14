const express = require("express")
const router = express.Router()
const userRouter = require("./user-route")
const projectRouter = require("./project-route")
const todoRouter = require("./todo-route")

router.use("/users", userRouter)
router.use("/projects", projectRouter)
router.use("/todos", todoRouter)

module.exports = router