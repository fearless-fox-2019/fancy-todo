const Project = require("../models/project")

module.exports = (req, res, next) => {
    Project.findOne({_id: req.params.id})
    .then(project =>{
        var found = project.members.includes(req.headers.decoded._id)
        if(found) {
            next()
        }else{
            throw({
                code: 401,
                message: "Unauthorized"
            })
        }
    })
    .catch(next)
}