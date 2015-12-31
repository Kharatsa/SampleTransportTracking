'use strict';

const path = require('path');

const NODE_ENV = process.env.NODE_ENV || 'development';
const IS_PRODUCTION = NODE_ENV === 'production';
const PUBLIC_PATH = path.join(__dirname, '..', '/public');
const PORT = 8081;
const HOST = 'localhost';

module.exports = {
  PORT, HOST, PUBLIC_PATH, IS_PRODUCTION, NODE_ENV
};
