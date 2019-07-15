const express = require("express")
const router = express.Router()
const userRouter = require("./user-route")
const todoRouter = require("./todo-route")
const interestRouter = require("./interest-route")

router.use("/users", userRouter)
router.use("/todos", todoRouter)
router.use("/interest", interestRouter)

module.exports = router
