'use strict';

// ODK Aggregate settings
const PROTOCOL = process.env.ODK_PROTOCOL || 'http';
const HOST = process.env.ODK_HOSTNAME || 'odk.kharatsa.com';
const URL = PROTOCOL + '://' + HOST;
const USERNAME = process.env.ODK_USERNAME || '';
const PASSWORD = process.env.ODK_PASSWORD || '';
const PUBLISHER_TOKEN = process.env.ODK_PUBLISHER_TOKEN || '';
const SUBMISSION_MAX_LENGTH = process.env.SUBMISSION_MAX_LENGTH || 10485760;

module.exports = {
  PROTOCOL, HOST, URL, USERNAME, PASSWORD, PUBLISHER_TOKEN,
  SUBMISSION_MAX_LENGTH
};
