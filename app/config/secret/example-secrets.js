'use strict';

/**
 * This file demonstrates the required syntax for the secrets.js file. The real
 * secret credentials must be added in a file in this same directory named
 * secrets.js
 */

/**
 * The ODK Aggregate password for the user in the config.js ODK.username var.
 *
 * @const
 * @type {String}
 */
const odkPassword = 'password';
exports.ODK_PASSWORD = odkPassword;

/**
 * The ODK Aggregate Authorizaation token for form publishers.
 *
 * @const
 * @type {String}
 */
const odkPublisherToken = 'token';
exports.ODK_PUBLISHER_TOKEN = odkPublisherToken;
