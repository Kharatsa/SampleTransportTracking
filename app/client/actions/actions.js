'use strict';

// https://github.com/acdlite/flux-standard-action
// http://rackt.org/redux/docs/basics/Actions.html

/*
 * action types
 */

exports.SOMETHING = 'SOMETHING';
exports.SOMETHING_ELSE = 'SOMETHING_ELSE';

/*
 * other constants
 */

/*
 * action creators
 */

exports.doSomething = function doSomethingFunc(value) {
  return { type: SOMETHING, value: value };
};

exports.doSomethingElse = function doSomethingElseFunc(value) {
  return { type: SOMETHING_ELSE, value: value };
};
