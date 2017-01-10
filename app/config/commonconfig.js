'use strict';

const envOrDefault = key => process.env[key] || defaults[key];

const defaults = {
  LANGUAGE_CODE: 'en-US',
  TIME_ZONE: 'Africa/Johannesburg',
  DATE_FORMAT: 'YYYY-MM-DD',
  DATETIME_FORMAT: 'YYYY-MM-DD HH:mm:ss',
  DATETIME_FORMAT_LONG: 'YYYY-MM-DD HH:mm:ss',
};

exports.LANGUAGE_CODE = envOrDefault('LANGUAGE_CODE');
exports.TIME_ZONE = envOrDefault('TIME_ZONE');
exports.DATE_FORMAT = envOrDefault('DATE_FORMAT');
exports.DATETIME_FORMAT = envOrDefault('DATETIME_FORMAT');
