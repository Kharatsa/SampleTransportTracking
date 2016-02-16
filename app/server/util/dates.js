'use strict';

const BPromise = require('bluebird');

const DATE_PATTERN = /([0-9]{4})-([0-9]{2})-([0-9]{2}) ([0-9]{2}):([0-9]{2}):([0-9]{2})\.([0-9]{1})/;

const TIMEZONE_PARTIAL_PATTERN = /(\+|-)\d{2}$/;

const parseXMLDate = val => {
  return new BPromise((resolve, reject) => {

    const match = val.match(DATE_PATTERN);
    if (match) {

      const numbers = BPromise.map(match.slice(1, 8), str => parseInt(str, 10));
      const parsed = numbers.then(parts => {
        // Month values must be in the 0-11 rather than 1-12 range
        const monthNum = parts[1];
        parts.splice(1, 1, monthNum - 1);
        return parts;
      })
      .then(parts => new Date(Date.UTC.apply(null, parts)));

      return parsed.then(resolve).catch(reject);

    } else if (val.search(TIMEZONE_PARTIAL_PATTERN) !== -1) {

      resolve(new Date(val + ':00'));

    } else {

      const parsed = Date.parse(val);
      if (Number.isNaN(parsed)) {
        return resolve(null);
      }
      return resolve(new Date(parsed));

    }
  });
};

module.exports = {
  parseXMLDate
};
