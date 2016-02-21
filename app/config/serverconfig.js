'use strict';

const path = require('path');

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development';
}
const PUBLIC_PATH = path.join(__dirname, '..', '/public');
const LISTEN_PORT = process.env.STT_LISTEN_PORT || 8081;
const LISTEN_HOST = process.env.STT_LISTEN_HOST || 'localhost';
const PUBLIC_URL = process.env.STT_PUBLIC_URL || 'https://kharatsa.com';

module.exports = {
  PUBLIC_PATH, LISTEN_PORT, LISTEN_HOST, PUBLIC_URL
};
