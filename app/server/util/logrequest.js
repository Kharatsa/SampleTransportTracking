'use strict';

const expressWinston = require('express-winston');
const config = require('app/config.js');
const appLogger = require('app/server/util/log.js');

// expressWinston.requestWhitelist.push('session');
// expressWinston.bodyWhitelist.push('secretid', 'secretproperty');
// expressWinston.bodyBlacklist.push('secretid', 'secretproperty');
// expressWinston.responseWhitelist.push('secretid', 'secretproperty');

var messageFormat;
if (config.isProduction) {
  // :remote-addr :remote-user :method :url HTTP/:http-version :status :res[content-length] - :response-time ms
  messageFormat = '';
} else {
  // :method :url :status :response-time ms - :res[content-length]
  messageFormat = '';
}

var requestLogger = expressWinston.logger({
  // transports: [appLogger],
  winstonInstance: appLogger,
  expressFormat: true,
  msg: 'HTTP {{req.method}} {{req.url}}',
});

var errorLogger = expressWinston.errorLogger({
  winstonInstance: appLogger,
});

module.exports = {
  requestLogger: requestLogger,
  errorLogger: errorLogger
};
