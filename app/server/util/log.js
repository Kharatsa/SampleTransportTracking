'use strict';

var winston = require('winston');
var winstonConfig = require('winston/lib/winston/config');
const config = require('app/config.js');
winston.level = config.loggingLevel;

var customLevels = {
  levels: {
    debug:  0,
    info:   1,
    warn:   2,
    error:  3
  },
  colors: {
    debug:  'blue',
    info:   'green',
    warn:   'yellow',
    error:  'red'
  }
};
winston.addColors(customLevels.colors);

var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      level: config.loggingLevel,
      levels: customLevels.levels,
      colorize: true,
      timestamp: function() {
        return new Date();
      },
      formatter: function(options) {
        // Return string will be passed to logger.
        return '[' + options.timestamp().toTimeString() + '] ' +
          winstonConfig.colorize(options.level,
            '[' + options.level.toUpperCase() + '] ') +
          (undefined !== options.message ? options.message : '') +
          (options.meta && Object.keys(options.meta).length ? '\n\t' +
            JSON.stringify(options.meta) : '');
      }
    }),
  ]
});

module.exports = logger;
