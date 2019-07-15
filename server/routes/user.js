const router = require("express").Router();
const UserController = require("../controllers/user");


router.post("/signin/google", UserController.signinGoogle);
router.post("/", UserController.signup);
router.post("/login", UserController.signin);


module.exports = router;