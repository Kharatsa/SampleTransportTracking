'use strict';

const BPromise = require('bluebird');

const parseLine = (keys, values) => {
  return keys.reduce((obj, key, i) => {
    obj[key] = values[i];
    return obj;
  }, {});
};

/**
 * [description]
 * @param {string} str [description]
 * @param  {Object} options [description]
 * @param {?string} [options.delimeter=','] [description]
 * @param {?boolean} [options.headers=false] [description]
 * @return {Promise.<Array.<Object>>}         [description]
 */
const parse = (str, options) => {
  options = options || {};
  const delimeter = options.delimeter || ',';
  const headers = (
    typeof options.headers === 'undefined' ?
    true :
    options.headers
  );

  return new BPromise((resolve, reject) => {
    const lines = str.split('\n');
    let parts = lines[0].trim().split(delimeter);

    let keys;
    if (headers) {
      keys = parts;
    } else {
      keys = [];
      for (let i = 0; i < parts.length; i++) {
        keys.push(i + '');
      }
    }

    return BPromise.map(headers ? lines.slice(1) : lines, line => {
      const trimmed = line.trim();
      return trimmed ? parseLine(keys, trimmed.split(delimeter)) : null;
    })
    .filter(result => result !== null)
    .then(result => resolve(result))
    .catch(err => reject(err));
  });
};

module.exports = {
  parse
};
