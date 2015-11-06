'use strict';

const BPromise = require('bluebird');
const parser = require('xml2js');

exports.parseXML = BPromise.promisify(parser.parseString);
