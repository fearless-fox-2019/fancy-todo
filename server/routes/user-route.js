const express = require("express")
const router = express.Router()
const userController = require("../controllers/user-controller")
const authenticate = require("../middlewares/authenticate")

router.post("/register", userController.register)
router.post("/login", userController.login)
router.post("/login/google", userController.googleSignin)
router.get("/all", userController.findAll)
router.get("/myprojects", authenticate, userController.getProjects)

module.exports = router