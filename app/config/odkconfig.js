'use strict';

var secrets;
try {
  secrets = require('./secret/secrets.js');
} catch (err) {
  throw new Error('Could not load secrets.js file');
}

// ODK Aggregate
const ODK_PROTOCOL = 'http';
const ODK_HOSTNAME = 'odk.kharatsa.com';
const aggregate = {
  PROTOCOL: ODK_PROTOCOL,
  HOST: ODK_HOSTNAME,
  URL: ODK_PROTOCOL + '://' + ODK_HOSTNAME,
  USERNAME: 'cornelltech',
  PASSWORD: secrets.ODK_PASSWORD
};

// ODK Aggregate simple JSON publisher config
const PUBLISHER_TOKEN = secrets.ODK_PUBLISHER_TOKEN;

module.exports = {aggregate, PUBLISHER_TOKEN};
