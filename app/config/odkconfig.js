'use strict';

// ODK Aggregate settings
const PROTOCOL = process.env.ODK_PROTOCOL || 'http';
const HOST = process.env.ODK_HOSTNAME;
const PORT = process.env.ODK_PORT || 80;
const PORT_STR = PORT === 80 ? '' : ':' + PORT;
const URL = `${PROTOCOL}://${HOST}${PORT_STR}`;
const USERNAME = process.env.ODK_USERNAME || 'admin';
const PASSWORD = process.env.ODK_PASSWORD || 'password';
const SUBMISSION_MAX_LENGTH = process.env.SUBMISSION_MAX_LENGTH || 10485760;

module.exports = {
  PROTOCOL, HOST, URL, PORT, USERNAME, PASSWORD, SUBMISSION_MAX_LENGTH
};
