module.exports = ((err, req, res, next) => {
  if(err) {
    const message = err.message || `Internal Server Error`
    const status =  err.status || 500
    console.log(`Middleware Error || \n`, err);
  }
  res.status(status).json({message})
})
