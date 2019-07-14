module.exports = function(err, req, res, next) {
    console.log(err);
    if (err.code === 404) {
      res.status(404).json({
        message: 'Resource Not Found',
      });
    } else if (err.status === 403) {
      console.log(err.name)
      res.status(403).json({
        message: 'Not Authorized',
      });
    } else {
      res.status(500).json({
        message: 'Internal Server Error',
      });
    }
} 