


module.exports = function(err,req,res,next){
    if(err.message == "BREAK_PROMISE"){
    }else{
        console.log('Error Handler');
        console.log(err)
        const status = err.code || 500
        const message = err.message || 'internal server error'
        res.status(status).json({
            message : message
        })
    }
}