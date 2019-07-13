function errHandler(err, req, res, next) {
  let status = null
  let message = {}

  console.log(err, 'ini di handler');
  if (err.code === 404) {
      status = 404
      message.err = 'Data Not Found'
  }
  else{
      status = 500
      message.err = `Internal server error`
  }


  res.status(status).json({message , err})
}

module.exports = errHandler