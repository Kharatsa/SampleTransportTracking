'use strict';

const moment = require('moment');
const log = require('server/util/logapp.js');

const DEFAULT_RANGE_DAYS = 30;

const defaultAfterDate = () => {
  const today = moment().utc().startOf('day');
  return today.subtract(DEFAULT_RANGE_DAYS, 'days').toISOString();
};

const parseDate = date => {
  const parsed = moment(date).utcOffset(0).startOf('day').toDate();
  return parsed.toISOString();
};

// Parse date strings into Date objects. Also, fill the default afterDate value
// if none is provided with the request.
const dateRangeMiddleware = () => (req, res, next) => {
  if (!req.query.afterdate) {
    req.query.afterdate = defaultAfterDate();
  } else {
    req.query.afterdate = parseDate(req.query.afterdate);
  }

  if (req.query.beforedate) {
    req.beforeDateOriginal = req.query.beforedate;
    req.query.beforedate = parseDate(req.query.beforedate);
  }
  log.info(`beforedate=${req.query.beforedate}, afterdate=${req.query.afterdate}`);
  next();
};

module.exports = {dateRangeMiddleware};
