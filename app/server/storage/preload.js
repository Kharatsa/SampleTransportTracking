'use strict';

const path = require('path');
const fs = require('fs');
const BPromise = require('bluebird');
BPromise.promisifyAll(fs);
const log = require('server/util/logapp.js');
const csv = require('server/util/csv.js');

/**
 * Converts metadata parsed from CSV to an Object for to a database model
 * @param  {Object} options
 * @param  {Array.<Object>} options.data  Data parsed from CSV
 * @param  {Object} options.attributes  Map of target Model attributes to
 *                                      source CSV column names (i.e.,
 *                                      {target: source})
 * @return {Promise.<Array.<Object>>}
 */
const transform = (options) => {
  const data = options.data;
  const attributes = options.attributes;
  const attrNames = Object.keys(attributes);
  return BPromise.map(data, item =>
    BPromise.reduce(attrNames, (reduced, targetAttr) => {
      const csvColName = attributes[targetAttr];
      reduced[targetAttr] = item[csvColName];
      return reduced;
    }, {})
  );
};

const metapath = `${path.join(__dirname,
  '..', '..', 'assets', 'xforms', 'metadata'
)}`;
try {
  fs.statSync(metapath);
} catch (err) {
  log.error(`Cannot locate metadata folder at ${metapath}\n${err}`);
}

// For merges to work properly, all keys (including references)
// should be converted to uppercase.
const keyValueToUpperCase = (item, keyAttr) => {
  let result = {};
  result[keyAttr] = item[keyAttr].toUpperCase();
  return Object.assign({}, item, result);
};

/**
 * Preload the specified CSV files into the database as metadata.
 *
 * @param {!Object} options
 * @param {!string} options.filename    Path to the metadata CSV file
 * @param {!Object} options.attributes  Mapping of CSV header names to database
 *                                      attribute names
 * @return {Promise.<Array.<Object>>}
 */
const metadata = BPromise.method((options) => {
  if (!(options && options.filename && options.attributes && options.handler)) {
    throw new Error('Missing required options parameter');
  }
  const handler = options.handler;
  const keyAttr = options.attributes.key;

  return fs.readFileAsync(path.join(metapath, options.filename), 'utf-8')
  .then(csv.parse)
  .map(item => keyValueToUpperCase(item, keyAttr))
  .then(data => transform({data, attributes: options.attributes}))
  .then(data => handler(data))
  .then(() => log.info(`Finished metadata preload for "${options.filename}"`))
  .catch(err =>
    log.error(`Failed metadata preload for "${options.filename}": `,
              err.message, err.errors)
  );
});

module.exports = {metadata};
