const express = require("express")
const router = express.Router()
const interestController = require("../controllers/interest-controller")

router.get("/?", interestController.getInterest)
module.exports = router