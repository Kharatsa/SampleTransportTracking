'use strict';

const DEFAULT_RANGE_DAYS = 30;
const DEFAULT_RANGE_MILLIS = DEFAULT_RANGE_DAYS * 24 * 60 * 60 * 1000;

const zeroPad = val => {
  if (val < 10 && val >= 0) {
    return `0${val}`;
  } else if (val > 10) {
    return `${val}`;
  }
  throw new Error('Cannot zeropad negative numbers');
};

/**
 * Translates a date object into a YYYY-MM-DD string
 * @param  {Date} date
 * @return {string}
 */
const dateString = date => {
  const year = date.getUTCFullYear();
  // Add 1 to the month because:
  //  "the value returned by getUTCMonth() is an integer between 0 and 11
  //   corresponding to the month" - MDN
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  return `${year}-${zeroPad(month)}-${zeroPad(day)}`;
};

const parseDateParam = date => {
  let result = new Date(date);
  if (Number.isNaN(result.valueOf())) {
    result = new Date(Date.now() - DEFAULT_RANGE_MILLIS);
  }
  return dateString(result);
};

// Parse date strings into Date objects. Also, fill the default afterDate value
// if none is provided with the request.
const dateRangeMiddleware = () => (req, res, next) => {
  req.afterDateOriginal = req.query.afterdate;
  req.query.afterdate = parseDateParam(req.query.afterdate);
  if (typeof req.query.beforedate !== 'undefined') {
    req.beforeDateOriginal = req.query.beforedate;
    req.query.beforedate = parseDateParam(req.query.beforedate);
  }
  next();
};

module.exports = {
  dateRangeMiddleware, parseDateParam
};
