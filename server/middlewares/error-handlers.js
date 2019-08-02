module.exports = (err, req, res, next) => {
  console.log(err);
  if (err.name === 'ValidationError') {
      res.status(400).json({
          error: err.message
      });
  } else {
      let status = err.status || 500
      let msg = err.msg || 'Internal server error'

      res.status(status).json({
          message: msg,
      });
  }
}