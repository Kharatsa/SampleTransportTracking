'use strict';

const path = require('path');
const BPromise = require('bluebird');
const statAsync = BPromise.promisify(require('fs').stat);
const log = require('server/util/logapp.js');

const databasePath = process.env.STT_DATA_PATH || '/var/lib/stt';
statAsync(databasePath)
.catch(function(err) {
  if (err.code === 'ENOENT') {
    throw new Error('Data directory does not exist', databasePath);
  } else {
    throw err;
  }
});

const connection = {
  username: process.env.MYSQL_USER || null,
  password: process.env.MYSQL_PASSWORD || null,
  name: process.env.MYSQL_DATABASE || null,
};

const MySQLConfig = {
  dialect: 'mysql',
  host: process.env.MYSQL_HOST || 'localhost',
  port: process.env.MYSQL_PORT || 3306,
  logging: log.debug
};

const SQLiteConfig = {
  dialect: 'sqlite',
  storage: path.join(databasePath, 'stt.sqlite'),
  logging: log.debug
};

const isMySQLAvailable = (
  connection.username === null ||
  connection.password === null ||
  connection.name === null
);

const defaultConfig = isMySQLAvailable ? MySQLConfig : SQLiteConfig;

const configs = {
  production: {
    username: connection.username,
    password: connection.password,
    database: connection.name,
    options: defaultConfig,
  },
  development: {
    username: connection.username,
    password: connection.password,
    database: connection.name,
    options: defaultConfig,
  },
  test: {
    dialect: 'sqlite',
    storage: ':memory:',
    logging: function() {},
  }
};

const getEnv = () => process.env.NODE_ENV || 'development';

log.debug(`Exporting ${getEnv()} configuration`);
log.debug(`MySQL ${isMySQLAvailable ? 'IS' : 'IS NOT'} available`);

const config = configs[getEnv()];

module.exports = {
  username: config.username,
  password: config.password,
  database: config.database,
  options: config.options,
};
