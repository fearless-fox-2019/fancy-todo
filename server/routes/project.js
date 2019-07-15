const router = require('express').Router()
const Project = require('../controllers/project')
const { authorizationProject } = require('../middlewares/authorization')

router.get('/test', (req, res) => {
    res.status(200).json({
        message: 'Project route'
    })
})

router.get('/', Project.findAll)
router.get('/:projectId', Project.findOne)
router.delete('/:projectId', authorizationProject, Project.delete)
router.patch('/member/:projectId/:userId', authorizationProject, Project.addMember)
router.delete('/member/:projectId/:userId', authorizationProject, Project.deleteMember)
router.patch('/:projectId', authorizationProject, Project.update)
router.post('/', Project.create)

module.exports = router