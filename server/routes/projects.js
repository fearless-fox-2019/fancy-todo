const router = require('express').Router()
const ControllerProject = require('../controllers/projects')
const authentication = require('../middlewares/authentication')
const {authOwner} = require('../middlewares/autorizeMember')

router.use(authentication)
router.get('/', ControllerProject.findAll)
router.post('/', ControllerProject.create)
router.patch('/editname/:projectId', authOwner, ControllerProject.editName)
router.patch('/kickmember/:projectId', authOwner, ControllerProject.kickMember)
router.post('/add/:projectId', authOwner, ControllerProject.addMember)
router.delete('/:projectId', authOwner, ControllerProject.delete)


module.exports = router
