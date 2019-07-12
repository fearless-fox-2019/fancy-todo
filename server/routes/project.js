const router= require('express').Router()
const projectController= require('../controllers/projectController')
const {authentication}= require('../middlewares/authenticate')

router.use(authentication)
router.get('/', projectController.findAll)
router.get('/:projectId', projectController.findOne)
router.post('/', projectController.create)
router.patch('/projectId', projectController.update)
router.patch('/invite/:projectId', projectController.inviteMember)
router.delete('/projectId', projectController.remove)


module.exports= router