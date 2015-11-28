'use strict';

const log = require('app/server/util/log.js');

/**
 * [handleShutdown description]
 *
 */
var handleShutdown = function() {
  var args = Array.prototype.slice.call(arguments);

  function gracefulShutdown(cb) {
    // Any additional teardown logic lives here
    log.info('Beginning teardown with %d handlers.', args.length);
    args.forEach(function(handler) {
      handler();
    });
    if (cb) {
      cb();
    }
  }

  function killProcess() {
    gracefulShutdown(function() {
      log.info('Teardown complete. Killing process', process.pid);
      process.kill(process.pid, 'SIGUSR2');
    });
  }

  process.once('SIGUSR2', killProcess);
  process.once('SIGTERM', killProcess);
};

module.exports = handleShutdown;
