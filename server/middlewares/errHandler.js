module.exports = function(err, req, res, next){
    if(err.code == 404){
        res.status(404).json({
            message : `not found`,
            err
        })
    } else if(err.code == 400){
        res.status(400).json({
            message : `Bad Request`,
            err
        })
    } else if (err.code == 403){
        res.status(403).json({
            message : `Forbidden`,
            err
        })
    } else if (err.code == 500){
        res.status(500).json({
            message : `Internal Server Error`,
            err
        })
    } else {
        console.log(err);
        
        res.status(500).json(err.message)
    }
}