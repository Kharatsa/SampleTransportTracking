'use strict';

const config = require('app/config');
const log = require('app/server/util/logapp.js');

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

// production error handler
// no stacktraces leaked to user
function handleProductionErrors(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }
  log.error('Request Error', err, err.stack);
  res.status(err.status || 500);
  res.send(err.message);
}

function handleDevelopmentErrors(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }
  log.error('Request Error', err, err.stack);
  res.status(err.status || 500);
  next(err);
}

const handleErrors = (
  config.server.isProduction() ?
  handleProductionErrors :
  handleDevelopmentErrors
);

module.exports = {
  normalizeParams,
  handleJSONErrors,
  handleErrors
};
