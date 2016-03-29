'use strict';

const BPromise = require('bluebird');

const recomposeRawSummary = (data, options) => {
  const nested = options.children || [];
  const template = nested.reduce((reduced, key) => {
    reduced[key] = {};
    return reduced;
  }, {});

  const parentModelName = options.parent;
  return BPromise.reduce(Object.keys(data), (reduced, key) => {
    const record = data[key];
    const parts = key.split('.');
    const modelName = parts[0];
    const columnName = parts[1];
    if (modelName === parentModelName) {
      reduced[columnName] = record;
    } else {
      reduced[modelName][columnName] = record;
    }
    return reduced;
  }, template);
};

module.exports = {
  recomposeRawSummary
};
