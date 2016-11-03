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
  username: process.env.STT_DB_USER || null,
  password: process.env.STT_DB_PASSWORD || null,
  database: process.env.STT_DB_NAME || null,
};

const MySQLConfig = {
  dialect: 'mysql',
  host: process.env.STT_DB_HOST || 'localhost',
  port: process.env.STT_DB_PORT || 3306,
  logging: log.debug
};

const SQLiteConfig = {
  dialect: 'sqlite',
  storage: path.join(databasePath, 'stt.sqlite'),
  logging: log.debug
};

const isMySQLInaccessible = (
  connection.username == null ||
  connection.password === null ||
  connection.database === null
);

const defaultConfig = isMySQLInaccessible ? SQLiteConfig : MySQLConfig;

const configs = {
  production: {
    username: connection.username,
    password: connection.password,
    database: connection.database,
    options: defaultConfig,
  },
  development: {
    username: connection.username,
    password: connection.password,
    database: connection.database,
    options: defaultConfig,
  },
  test: {
    dialect: 'sqlite',
    storage: ':memory:',
    logging: function() {},
  }
};

const getEnv = () => process.env.NODE_ENV || 'development';
const config = configs[getEnv()];

log.info(`MySQL ${isMySQLInaccessible ? 'IS NOT' : 'IS'} available. ` +
  `Exporting ${getEnv()} configuration`,
  JSON.stringify(config.options));

module.exports = {
  username: config.username,
  password: config.password,
  database: config.database,
  options: config.options,
};
