module.exports = function(err,req,res,next){
    console.log('ke error handler');
    console.log(err)
    const status = err.code || 500
    const message = err.message || 'internal server error'
    res.status(status).json({
        message : message
    })
}