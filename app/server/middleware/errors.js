'use strict';

const log = require('app/server/util/logapp.js');

const handleJSONErrors = (err, req, res, next) => {
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
};

// production error handler
// no stacktraces leaked to user
const handleProductionErrors = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  log.error('Request Error', err, err.stack);
  res.status(err.status || 500);
  res.send(err.message);
};

const handleDevelopmentErrors = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  log.error('Request Error', err, err.stack);
  res.status(err.status || 500);
  next(err);
};

const handleErrors = (
  process.env.NODE_ENV === 'production' ?
  handleProductionErrors :
  handleDevelopmentErrors
);

module.exports = {
  handleJSONErrors,
  handleErrors
};
