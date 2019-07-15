const router = require("express").Router();
const TodoController = require("../controllers/todo");

router.get("/", TodoController.findAll);
router.post("/", TodoController.create);

router.get("/:todoId", TodoController.findOne);
router.put("/:todoId", TodoController.update);
router.delete("/:todoId", TodoController.delete);


module.exports = router;