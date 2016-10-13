'use strict';

const path = require('path');

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development';
}

const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const AUTH_ENABLED = process.STT_AUTH_ENABLED || IS_PRODUCTION;
const PUBLIC_PATH = path.join(__dirname, '..', '/public');
const LISTEN_PORT = process.env.STT_LISTEN_PORT || 8081;
const LISTEN_HOST = process.env.STT_LISTEN_HOST || 'localhost';
const PUBLIC_URL = process.env.STT_PUBLIC_URL;
const LOG_PATH = process.env.STT_LOG_PATH || '/var/log/stt';

module.exports = {
  AUTH_ENABLED, PUBLIC_PATH, LISTEN_PORT, LISTEN_HOST, PUBLIC_URL, LOG_PATH,
};
