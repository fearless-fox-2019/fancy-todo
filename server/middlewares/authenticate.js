const User= require('../models/user')
const {verify}= require('../helpers/jwt')

module.exports={
     authentication(req, res, next){
         try {
            if(req.headers.hasOwnProperty('token')){
                let decode= verify(req.headers.token)
                req.decode= decode
        
                User.findOne({ email:req.decode.email})
                .then(user=>{
                    if(user){
                        next()
                    }else{
                        res.status(404).json('Not Found')
                    }
                })
        
            }else{
                res.status(401).json('Please provide token!')
            }

         } catch (error) {
             res.status(401).json('Please provide token!')
         }
        
        
    }
}
