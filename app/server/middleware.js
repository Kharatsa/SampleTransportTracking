'use strict';

const log = require('app/server/util/log.js');

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

function handleJSONErrors(err, req, res, next) {
  if (err.status) {
    var message = {'error': err.message};
    log.warn('Bad application/json request',
      err.message, err.stack, req.originalUrl
    );
    log.warn('Responding to error with status %s', err.status, message);
    res.status(err.status).json(message);
  } else {
    next(err);
  }
}

module.exports = {
  normalizeParams: normalizeParams,
  handleJSONErrors: handleJSONErrors
};
