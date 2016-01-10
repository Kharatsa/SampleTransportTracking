'use strict';

const BPromise = require('bluebird');

/**
 * @callback shouldLoopCallback
 * @return {boolean} Returns true when the halting condition has not been met
 */

/**
 * @callback promiseAction
 * @return {Promise}
 */

/**
 * [promiseWhile description]
 * @param  {shouldLoop} condition [description]
 * @param  {promiseAction} action    [description]
 * @return {Promise.<Array>}
 */
function promiseWhile(condition, action) {
  const loop = result => {
    result = result || [];
    if (!condition()) {
      return result;
    }
    return BPromise.join(action(), result, (next, last) => last.concat(next))
    .then(loop);
  };
  return BPromise.resolve().then(loop);
}


module.exports = {
  promiseWhile
};
