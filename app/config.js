'use strict';

const fs = require('fs');
const path = require('path');
const Bluebird = require('bluebird');
const secrets = require('app/secrets.js');
Bluebird.promisifyAll(fs);

const isProduction = process.env.NODE_ENV === 'production';
exports.isProduction = isProduction;
exports.loggingLevel = isProduction ? 'info' : 'debug';

const portNumber = 8081;
exports.portNumber = portNumber;

const publicPath = path.join(__dirname, 'server/public');
exports.publicPath = publicPath;

const dataDir = '/var/lib/strack';
fs.statAsync(dataDir)
.catch(function(err) {
  if (err.code === 'ENOENT') {
    throw new Error('Data directory does not exist', dataDir);
  } else {
    throw err;
  }
});
const sqliteFilename = path.join(dataDir, 'stracker.sqlite');
exports.sqliteFilename = sqliteFilename;

const publisherToken = secrets.ODK_PUBLISHER_TOKEN;
exports.publisherToken = publisherToken;

const ODK_PROTOCOL = 'http';
const ODK_HOSTNAME = 'odk.kharatsa.com';
exports.ODK = {
  protocol: ODK_PROTOCOL,
  hostname: ODK_HOSTNAME,
  url: ODK_PROTOCOL + '://' + ODK_HOSTNAME,
  username: 'cornelltech',
  password: secrets.ODK_PASSWORD
};
