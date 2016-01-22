'use strict';

// ODK Aggregate settings
const ODK_PROTOCOL = process.env.ODK_PROTOCOL || 'http';
const ODK_HOSTNAME = process.env.ODK_HOSTNAME || 'odk.kharatsa.com';
const ODK_USERNAME = process.env.ODK_USERNAME || '';
const ODK_PASSWORD = process.env.ODK_PASSWORD || '';
const ODK_PUBLISHER_TOKEN = process.env.ODK_PUBLISHER_TOKEN || '';

const aggregate = {
  PROTOCOL: ODK_PROTOCOL,
  HOST: ODK_HOSTNAME,
  URL: ODK_PROTOCOL + '://' + ODK_HOSTNAME,
  USERNAME: ODK_USERNAME,
  PASSWORD: ODK_PASSWORD
};

// ODK Aggregate simple JSON publisher config
const PUBLISHER_TOKEN = ODK_PUBLISHER_TOKEN;

module.exports = {aggregate, PUBLISHER_TOKEN};
