const express = require('express')
const projectRouter = express.Router()
const ProjectController = require('../controllers/projectController')
const authentication = require('../middlewares/authentication')
const {authorizationProject} = require('../middlewares/authorization')

projectRouter.use(authentication)
projectRouter.get('/my', ProjectController.fetchMine)
projectRouter.get('/group',ProjectController.fetchCollab)
projectRouter.get('/detail/:id',ProjectController.fetchDetail)
projectRouter.get('/one/:id',ProjectController.findOneProject)
projectRouter.post('/',ProjectController.createProject)
projectRouter.put('/:id',ProjectController.addTodo)
projectRouter.get('/send/:id/:email',ProjectController.sendEMailto)

projectRouter.use('/:id',authorizationProject)
projectRouter.patch('/:id/invite',ProjectController.addMember)
projectRouter.patch('/:id/remove',ProjectController.deleteMember)
projectRouter.delete('/:id',ProjectController.delete)
projectRouter.patch('/:id/edit',ProjectController.update)


module.exports = projectRouter
