'use strict';

const expressWinston = require('express-winston');
const appLogger = require('app/server/util/logapp.js');

// expressWinston.requestWhitelist.push('session');
// expressWinston.bodyWhitelist.push('secretid', 'secretproperty');
// expressWinston.bodyBlacklist.push('secretid', 'secretproperty');
// expressWinston.responseWhitelist.push('secretid', 'secretproperty');

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
