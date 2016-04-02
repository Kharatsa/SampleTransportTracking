'use strict';

const DEFAULT_RANGE_DAYS = 30;
const DEFAULT_RANGE_MILLIS = DEFAULT_RANGE_DAYS * 24 * 60 * 60 * 1000;

const parseDateParam = date => {
  let result = new Date(date);
  if (Number.isNaN(result.valueOf())) {
    result = new Date(Date.now() - DEFAULT_RANGE_MILLIS);
  }
  return result.toISOString();
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
