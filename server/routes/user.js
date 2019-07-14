const express = require("express")
const router = express.Router()
const userController = require("../controllers/userController")

router.post("/register", userController.register)
router.post("/login", userController.login)
router.post("/glogin", userController.googleLogin)


module.exports = router