const Helper = require('../helpers/helper')
const User = require('../models/user')
const Todo = require('../models/todo')
const Project = require('../models/project')

module.exports = {
    authentication :    async (req, res, next) => {
        try {
            console.log(req.headers.access_token, 'ini token di middleware')
            const decoded = Helper.verifyJWT(req.headers.access_token);

            let user = await User.findById(decoded._id)

            if(user){

                req.loggedUser = user
                console.log(req.loggedUser)
                
                next()
            } else {
                next({code : 401, msg : 'unauthorized'})
            }

        } catch (err) {
            res.status(500).json(err)
        }

    },
    authorization : {
        todo : async (req, res, next) => {

            try {

                let todo = await Todo.findById(req.params.id)
                
                if(todo.userId === req.loggedUser._id) next()

                else next({code : 401, msg : 'unauthorized, this todo isn`t yours'})

            } catch (error) {
                next(error)
            }
            
        }, 
        project : async (req, res, next) => {

            try {

                let project = await Project.findById(req.params.id)
                console.log('project: ', project);
                console.log('req.loggedUser._id: ', req.loggedUser._id);
                
                let flag = false

                for(let i = 0; i < project.fix_members.length; i++){

                    console.log('project.fix_members[i]: ', typeof project.fix_members[i]);
                    console.log('req.loggedUser._id: ', typeof req.loggedUser._id);
                    if(project.fix_members[i].toString() === req.loggedUser._id.toString()){
                        flag = true
                        break;
                    }

                }

                console.log('flag: ', flag);
                if(flag) next()
                else throw({code : 401, msg : 'unauthorized, you are not listed in project members'})

            } catch (error) {
                next(error)
            }
            
        }, 

        invite : async (req, res, next) => {

            try {

                let project = await Project.findById(req.params.id)
                
                let flag = false

                for(let i = 0; i < project.pending_members.length; i++){
                    if(project.pending_members[i].toString() === req.loggedUser._id.toString()){
                        flag = true
                        break;
                    }
                }

                if(flag) next()
                else next({code : 401, msg : 'unauthorized, you are not invited'})

            } catch (error) {

                next(error)
                
            }
            
        }, 


    }
}