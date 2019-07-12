module.exports = function (err, req, res, next) {
    let code
    let message

    console.log(err)
    if (err.code === 400) {
        code = 400
        message = {
            error: `Bad request`,
            err
        }
    } else if (err.code === 404) {
        code = 404
        message = {
            error: `Not found`,
            err
        }
    } else{
        code = 500
        message = {
            error: `Internal server error`,
            err
        }
    }
    res.status(code).json(message)
}