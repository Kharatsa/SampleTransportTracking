'use strict';

const offsetMiddleware = limit => {
  return (req, res, next) => {
    const page = req.query.page || 1;
    req.offset = limit * (page - 1);
    next();
  };
};

module.exports = offsetMiddleware;
