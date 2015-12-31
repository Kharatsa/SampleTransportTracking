'use strict';

const log = require('app/server/util/log.js');

/**
 * [handleShutdown description]
 *
 */

var handlers = [];

var handleShutdown = function() {

  function gracefulShutdown(cb) {
    // Any additional teardown logic lives here
    log.info('Beginning teardown with %d handlers.', handlers.length);
    handlers.forEach(function(handler) {
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

module.exports = {
  init: handleShutdown,

  add: function(shutdownFunc) {
    handlers.push(shutdownFunc);
  }
};
