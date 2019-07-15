const router = require("express").Router();
const UserRouter = require("./user");
const TodoRouter = require("./todo");

router.get("/", function(req, res){
    console.log("router OK");
    res.send("FANCY TODO API");
});

router.use("/users", UserRouter);
router.use("/todos", TodoRouter);


module.exports = router;