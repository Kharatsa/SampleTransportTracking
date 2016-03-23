'use strict';

const metaKeyMiddleware = attr => {
  return keys => {
    return (req, res, next) => {
      keys.forEach(key => {
        const original = req[attr][key];
        if (typeof original !== 'undefined') {
          req[attr][key] = original.toUpperCase();
        }
      });
      next();
    };
  };
};

// Handles the req.params object
const upperCaseParamsMiddleware = metaKeyMiddleware('params');

// Handles the req.query object
const upperCaseQueryMiddleware = metaKeyMiddleware('query');

module.exports = {
  upperCaseParamsMiddleware, upperCaseQueryMiddleware
};
