'use strict';

const Bluebird = require('bluebird');
const parser = require('xml2js');

exports.parseXML = Bluebird.promisify(parser.parseString);
