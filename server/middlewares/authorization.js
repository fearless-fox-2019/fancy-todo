const Project= require('../models/project')

function authorization(req, res, next){
    console.log('masuk authorize')
    Project.findById(req.params.projectId)
    .then(project=>{
        if(!project){
            res.status(404).json('Not found')
        }else{
            if(req.decode.id == project.creator){
                next()
            }else{
                res.status(403).json('Not Authorized')
            }
        }
    })
    .catch(next)
}

module.exports= authorization