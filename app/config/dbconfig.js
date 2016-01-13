'use strict';

const path = require('path');
const BPromise = require('bluebird');
const statAsync = BPromise.promisify(require('fs').stat);
const log = require('app/server/util/log.js');
const serverconfig = require('./serverconfig.js');

const databasePath = '/var/lib/strack';
statAsync(databasePath)
.catch(function(err) {
  if (err.code === 'ENOENT') {
    throw new Error('Data directory does not exist', databasePath);
  } else {
    throw err;
  }
});
const sqlitePath = path.join(databasePath, 'stracker.sqlite');


/*
 * Sequelize database configuration objects.
 * http://docs.sequelizejs.com/en/latest/api/sequelize/
 */

// Default SQLite database
const defaultConfig = {
  dialect: 'sqlite',
  storage: sqlitePath,
  logging: log.debug,
  define: {underscored: true}
};

// Define additional configuration objects here, and add to databaseConfigs

const databaseConfigs = {
  production: defaultConfig,
  development: defaultConfig,
  test: {
    dialect: 'sqlite',
    storage: ':memory:',
    logging: function() {},
    define: {underscored: true}
  }
};

module.exports = databaseConfigs[serverconfig.NODE_ENV];