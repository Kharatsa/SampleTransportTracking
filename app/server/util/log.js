'use strict';

const util = require('util');
const winston = require('winston');
const winstonConfig = require('winston/lib/winston/config');
const transports = require('winston/lib/winston/transports');
const common = require('winston/lib/winston/common');

const LOG_LEVEL = (function() {
  if (process.env.NODE_ENV === 'production') {
    return 'info';
  } else if (process.env.NODE_ENV === 'test') {
    return 'warn';
  }
  return 'debug';
}());

winston.level = LOG_LEVEL;

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

function getTimeStamp(timestamp) {
  return '[' + timestamp.toISOString() + '] ';
}

function getLogLevel(level) {
  return winstonConfig.colorize(level, ' [' + level.toUpperCase() + '] ');
}

function getLogMessage(message) {
  if (typeof message !== 'undefined') {
    return message;
  }
  return '';
}

function getLogMeta(meta) {
  if (meta && Object.keys(meta).length > 0) {
    return '\n\t' + util.format('%j', meta);
  }
  return '';
}

var STTConsoleTransport = transports.stt = function(options) {
  transports.Console.call(this, options);
  this.name = 'stt';
  this.level = options.level || 'info';
};
util.inherits(STTConsoleTransport, transports.Console);

// This is largely a copy of winston's standard console logger transport.
// Certain objects (e.g., Sequelize) have circular references or are just too
// large for winston to manage without crashing (specifically in the clone
// method of common.js). This transport replaces the "meta" parameter, which
// may include an object, with an empty object. The value of this meta object
// is appended to msg, if present. The util.format function used for this
// process only iterates 2 levels down an object heirarchy by default.
STTConsoleTransport.prototype.log = function(level, msg, meta, callback) {
  if (this.silent) {
    return callback(null, true);
  }

  if (meta && Object.keys(meta).length > 0) {
    msg += util.format('\n\t%j', meta);
  }

  var self = this;
  var output = common.log({
    colorize:    this.colorize,
    json:        this.json,
    level:       level,
    message:     msg,
    meta:        {},
    stringify:   this.stringify,
    timestamp:   this.timestamp,
    showLevel:   this.showLevel,
    prettyPrint: this.prettyPrint,
    raw:         this.raw,
    label:       this.label,
    logstash:    this.logstash,
    depth:       this.depth,
    formatter:   this.formatter,
    align:       this.align,
    humanReadableUnhandledException: this.humanReadableUnhandledException
  });

  if (this.stderrLevels[level]) {
    process.stderr.write(output + '\n');
  } else {
    process.stdout.write(output + this.eol);
  }

  //
  // Emit the `logged` event immediately because the event loop
  // will not exit until `process.stdout` has drained anyway.
  //
  self.emit('logged');
  callback(null, true);
};

var stttransport = new STTConsoleTransport({
  level: LOG_LEVEL,
  levels: customLevels.levels,
  depth: 2,
  colorize: true,
  timestamp: function() { return new Date(); },
  formatter: function(options) {
    // Return string will be passed to logger.
    return (
      getTimeStamp(options.timestamp()) + ' ' +
      getLogLevel(options.level) +
      getLogMessage(options.message) +
      getLogMeta(options.meta)
    );
  }
});

var logger = new (winston.Logger)({
  transports: [stttransport]
});

module.exports = logger;
