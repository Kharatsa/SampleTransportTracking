'use strict';

const moment = require('moment');

/**
 * Generate an array of ISO8601 Date strings between 2 dates (inclusive).
 *
 * @param {Object} options [description]
 * @param  {string} options.startDate    ISO8601 Date string
 * @param  {string} options.endDate      ISO8601 Date string
 * @param {string} [options.unit='days'] Unit of time between each date
 * @return {Array.<string>}
 */
const allDatesBetween = (options) => {
  options = options || {};
  const afterDate = options.afterDate;
  const beforeDate = options.beforeDate;

  const startMoment = moment.utc(new Date(afterDate)).startOf('day');
  const endMoment = moment.utc(new Date(beforeDate)).startOf('day');

  let dates = [];
  let currentMoment = startMoment;
  while (currentMoment <= endMoment) {
    dates.push(currentMoment.clone());
    currentMoment = currentMoment.add(1, 'days');
  }

  return dates;
};

module.exports = {allDatesBetween};
