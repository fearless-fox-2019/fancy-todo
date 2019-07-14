const router = require('express').Router()
const todoController = require('../controllers/todoController')
const authetication = require ('../middlewares/authenticationJWT')
const authorization = require('../middlewares/authorizationJWT')

router.post('/',todoController.create)
router.get('/',authetication,todoController.read)
router.get('/undone',authetication,todoController.readUndone)
router.put('/:id',authetication,authorization,todoController.update)
router.delete('/:id',authetication,authorization,todoController.destroy)
module.exports = router