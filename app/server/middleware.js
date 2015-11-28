'use strict';

// Convert query parameters to lowercase
const normalizeParams = function(req, res, next) {
  var result = {};
  if (req.query) {
    Object.keys(req.query).forEach(function(key) {
      result[key.toLowerCase()] = req.query[key];
    });
    req.query = result;
  }
  next();
};

module.exports = {
  normalizeParams: normalizeParams
};
