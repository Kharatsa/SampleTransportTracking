'use strict';

const path = require('path');
const secrets = require('app/secrets.js');

const isProduction = process.env.NODE_ENV === 'production';
exports.isProduction = isProduction;
exports.loggingLevel = isProduction ? 'info' : 'debug';

const portNumber = 8081;
exports.portNumber = portNumber;

const sqliteFilename = path.join(__dirname, 'data', 'stracker.sqlite');
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
