'use strict';

// ODK Aggregate settings
const PROTOCOL = process.env.ODK_PROTOCOL || 'http';
const HOST = process.env.ODK_HOSTNAME;
const URL = PROTOCOL + '://' + HOST;
const USERNAME = process.env.ODK_USERNAME || 'admin';
const PASSWORD = process.env.ODK_PASSWORD || 'password';
const SUBMISSION_MAX_LENGTH = process.env.SUBMISSION_MAX_LENGTH || 10485760;

module.exports = {
  PROTOCOL, HOST, URL, USERNAME, PASSWORD, SUBMISSION_MAX_LENGTH
};
