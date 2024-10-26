// common/middleware/requestTime.js
const requestTime = (req, res, next) => {
    req.requestTime = Date.now();
    console.log('Request Time:', new Date(req.requestTime).toLocaleString());
    next();
  };
  
  module.exports = requestTime;
  