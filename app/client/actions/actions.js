'use strict';

var BPromise = require('bluebird');
var request = require('request');
var store = require('../index.js').store;
var getAsync = BPromise.promisify(request.get);

// https://github.com/acdlite/flux-standard-action
// http://rackt.org/redux/docs/basics/Actions.html

/*
 * action types
 */
var RECEIVE_SAMPLES = 'RECEIVE_SAMPLES';

/*
 * other constants
 */

/*
 * action creators
 */
function receiveSamples(samples) {
  return {
    type: RECEIVE_SAMPLES,
    updates: samples
  };
}

var getAllSamples = function() {
  return getAsync('/tracker/ids')
  .then(function(result) {
    store.dispatch(receiveSamples(result));
  });
};

/*
 * exports
 */
module.exports = {
  RECEIVE_SAMPLES: RECEIVE_SAMPLES,
  getAllSamples: getAllSamples,
};
