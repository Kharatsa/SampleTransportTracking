'use strict';

const path = require('path');

const NODE_ENV = process.env.NODE_ENV || 'development';
const IS_PRODUCTION = NODE_ENV === 'production';
const PUBLIC_PATH = path.join(__dirname, '..', '/public');
const LISTEN_PORT = 8081;
const LISTEN_HOST = '0.0.0.0';
const HOSTNAME = IS_PRODUCTION ? 'kharatsa.com' : '108.30.53.92:8081';

module.exports = {
  LISTEN_PORT, LISTEN_HOST, HOSTNAME, PUBLIC_PATH, IS_PRODUCTION, NODE_ENV
};
