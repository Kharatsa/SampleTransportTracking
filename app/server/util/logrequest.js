'use strict';

const expressWinston = require('express-winston');
const appLogger = require('app/server/util/logapp.js');

var requestLogger = expressWinston.logger({
  winstonInstance: appLogger,
  expressFormat: true,
  msg: 'HTTP {{req.method}} {{req.url}}'
});

var errorLogger = expressWinston.errorLogger({
  winstonInstance: appLogger
});

module.exports = {
  requestLogger: requestLogger,
  errorLogger: errorLogger
};
