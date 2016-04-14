'use strict';

const log = require('server/util/logapp.js');

const handleRemoveResult = (count, type, keyName, key) => {
  if (count > 0) {
    log.info(`Successfully deleted ${count} ${type} record(s)`);
  } else {
    log.error(`Could not locate ${type} record where ${keyName}=${key}`);
  }
};

module.exports = {handleRemoveResult};
