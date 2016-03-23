'use strict';

// Convert query parameters to lowercase
const lowerCaseQueryKeys = () => {
  return (req, res, next) => {
    var result = {};
    if (req.query) {
      Object.keys(req.query).forEach(key => {
        result[key.toLowerCase()] = req.query[key];
      });
      req.query = result;
    }
    next();
  };
};

module.exports = {
  lowerCaseQueryKeys
};
