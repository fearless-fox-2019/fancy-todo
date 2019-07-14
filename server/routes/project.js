const router= require('express').Router()
const projectController= require('../controllers/projectController')
const {authentication}= require('../middlewares/authenticate')
const authorization = require('../middlewares/authorization')

router.use(authentication)
router.get('/', projectController.findAll)
router.get('/:projectId', projectController.findOne)
router.post('/', projectController.create)
router.patch('/:projectId', authorization, projectController.update)
router.patch('/invite/:projectId',authorization, projectController.addMember)
router.delete('/:projectId',authorization, projectController.remove)


module.exports= router